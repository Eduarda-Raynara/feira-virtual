import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRole = 'cliente' | 'vendedor';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  nome!: string;

  @Prop({ required: true, enum: ['cliente', 'vendedor'] })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);