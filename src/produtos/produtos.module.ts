import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Produto, ProdutoSchema } from './schemas/produto.schema';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Produto.name, schema: ProdutoSchema }])],
  providers: [ProdutosService],
  controllers: [ProdutosController],
})
export class ProdutosModule {}