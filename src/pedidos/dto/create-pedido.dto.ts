import { IsArray, IsMongoId, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsMongoId() produtoId!: string;

  @IsNumber() @Min(1) quantidade!: number;
}

export class CreatePedidoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens!: ItemPedidoDto[];
}