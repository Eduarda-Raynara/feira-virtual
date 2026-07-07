import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PedidoStatus = 'pendente' | 'concluido' | 'cancelado';

@Schema()
export class ItemPedido {
  @Prop({ type: Types.ObjectId, ref: 'Produto', required: true })
  produto!: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantidade!: number;

  @Prop({ required: true })
  precoUnitario!: number;
}

export const ItemPedidoSchema = SchemaFactory.createForClass(ItemPedido);

@Schema({ timestamps: true })
export class Pedido extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  cliente!: Types.ObjectId;

  @Prop({ type: [ItemPedidoSchema], required: true })
  itens!: ItemPedido[];

  @Prop({ required: true })
  total!: number;

  @Prop({ required: true, enum: ['pendente', 'concluido', 'cancelado'], default: 'pendente' })
  status!: PedidoStatus;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);