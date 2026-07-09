import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { CepService } from './cep.service';
import { CepController } from './cep.controller';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    CacheModule.register(),
  ],
  providers: [CepService],
  controllers: [CepController],
})
export class CepModule {}