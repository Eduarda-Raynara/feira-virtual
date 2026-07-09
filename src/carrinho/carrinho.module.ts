import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';

@Module({
  controllers: [CarrinhoController]
})
export class CarrinhoModule {}
