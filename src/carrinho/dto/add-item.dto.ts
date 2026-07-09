import { IsMongoId, IsNumber, Min } from 'class-validator';

export class AddItemCarrinhoDto {
  @IsMongoId() produtoId!: string;
  @IsNumber() @Min(1) quantidade!: number;
}