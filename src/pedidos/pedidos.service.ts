import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from './schemas/pedido.schema';
import { Produto } from '../produtos/schemas/produto.schema';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    @InjectModel(Produto.name) private produtoModel: Model<Produto>,
  ) {}

  async create(dto: CreatePedidoDto, clienteId: string) {
    let total = 0;
    const itens: { produto: any; quantidade: number; precoUnitario: number }[] = [];

    for (const item of dto.itens) {
      const produto = await this.produtoModel.findById(item.produtoId);
      if (!produto) {
        throw new NotFoundException(`Produto ${item.produtoId} não encontrado`);
      }
      if (produto.estoque < item.quantidade) {
        throw new ConflictException(`Estoque insuficiente para "${produto.nome}"`);
      }
      total += produto.preco * item.quantidade;
      itens.push({
        produto: produto._id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
      });
    }

    for (const item of dto.itens) {
      await this.produtoModel.findByIdAndUpdate(item.produtoId, {
        $inc: { estoque: -item.quantidade },
      });
    }

    return this.pedidoModel.create({
      cliente: clienteId,
      itens,
      total,
      status: 'pendente',
    });
  }

  findMeusPedidos(clienteId: string) {
    return this.pedidoModel
      .find({ cliente: clienteId })
      .populate('itens.produto', 'nome preco')
      .sort({ createdAt: -1 });
  }

  findAll() {
    return this.pedidoModel
      .find()
      .populate('cliente', 'nome email')
      .populate('itens.produto', 'nome preco')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const pedido = await this.pedidoModel
      .findById(id)
      .populate('cliente', 'nome email')
      .populate('itens.produto', 'nome preco');
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }

  async updateStatus(id: string, dto: UpdateStatusDto, userId: string, userRole: string) {
    const pedido = await this.findOne(id);

    if (pedido.status !== 'pendente') {
      throw new BadRequestException(`Pedido já está "${pedido.status}", não pode ser alterado`);
    }

    if (dto.status === 'cancelado' && userRole === 'cliente') {
      if (pedido.cliente._id.toString() !== userId) {
        throw new ForbiddenException('Você não pode cancelar pedido de outro cliente');
      }
    } else if (userRole !== 'vendedor') {
      throw new ForbiddenException('Apenas o vendedor pode concluir um pedido');
    }

    if (dto.status === 'cancelado') {
      for (const item of pedido.itens) {
        await this.produtoModel.findByIdAndUpdate(item.produto, {
          $inc: { estoque: item.quantidade },
        });
      }
    }

    pedido.status = dto.status;
    return pedido.save();
  }
}