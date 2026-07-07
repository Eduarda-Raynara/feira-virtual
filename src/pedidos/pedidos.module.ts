import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './schemas/pedido.schema';
import { Produto, ProdutoSchema } from '../produtos/schemas/produto.schema';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Produto.name, schema: ProdutoSchema },
    ]),
  ],
  providers: [PedidosService],
  controllers: [PedidosController],
})
export class PedidosModule {}