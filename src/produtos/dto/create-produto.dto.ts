import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsString() @IsNotEmpty() nome: string;
  @IsString() @IsNotEmpty() descricao: string;

  @Type(() => Number) @IsNumber() @Min(0)
  preco: number;

  @Type(() => Number) @IsNumber() @Min(0)
  estoque: number;
}