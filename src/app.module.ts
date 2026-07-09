import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { getMemoryMongoUri } from './mongo-memory';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { CepModule } from './cep/cep.module';
import { CarrinhoModule } from './carrinho/carrinho.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URI ?? (await getMemoryMongoUri()),
      }),
    }),
    UsersModule,
    AuthModule,
    ProdutosModule,
    PedidosModule,
    CepModule,
    CarrinhoModule,
  ],
})
export class AppModule {}