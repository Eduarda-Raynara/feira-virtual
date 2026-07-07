import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Produto } from './schemas/produto.schema';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(@InjectModel(Produto.name) private produtoModel: Model<Produto>) {}

  create(dto: CreateProdutoDto, vendedorId: string, imagem?: string) {
    return this.produtoModel.create({ ...dto, vendedor: vendedorId, imagem });
  }

  findAll(page = 1, limit = 10) {
    return this.produtoModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vendedor', 'nome email');
  }

  async findOne(id: string) {
    const produto = await this.produtoModel.findById(id).populate('vendedor', 'nome email');
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async update(id: string, dto: UpdateProdutoDto, userId: string) {
    const produto = await this.findOne(id);
    if (produto.vendedor._id.toString() !== userId) {
      throw new ForbiddenException('Você não pode editar produto de outro vendedor');
    }
    Object.assign(produto, dto);
    return produto.save();
  }

  async remove(id: string, userId: string) {
    const produto = await this.findOne(id);
    if (produto.vendedor._id.toString() !== userId) {
      throw new ForbiddenException('Você não pode remover produto de outro vendedor');
    }
    return produto.deleteOne();
  }
}