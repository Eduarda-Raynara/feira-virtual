import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class CepService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      throw new BadRequestException('CEP inválido, precisa ter 8 dígitos');
    }

    const cacheKey = `cep:${cepLimpo}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {

          throw new ServiceUnavailableException('Serviço de CEP indisponível no momento');
        }),
      ),
    );

    if (data.erro) {
      throw new BadRequestException('CEP não encontrado');
    }

    await this.cacheManager.set(cacheKey, data, 3600000);

    return data;
  }
}