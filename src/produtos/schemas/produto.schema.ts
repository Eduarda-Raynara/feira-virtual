import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Produto extends Document {
  @Prop({ required: true })
  nome!: string;

  @Prop({ required: true })
  descricao!: string;

  @Prop({ required: true })
  preco!: number;

  @Prop({ required: true, default: 0 })
  estoque!: number;

  @Prop()
  imagem?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  vendedor!: Types.ObjectId;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);