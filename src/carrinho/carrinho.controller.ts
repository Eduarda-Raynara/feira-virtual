import { Controller, Get, Post, Delete, Body, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AddItemCarrinhoDto } from './dto/add-item.dto';

interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
}

@Controller('carrinho')
export class CarrinhoController {
  private lerCarrinho(req: Request): ItemCarrinho[] {
    const raw = req.cookies?.carrinho;
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private salvarCarrinho(res: Response, itens: ItemCarrinho[]) {
    res.cookie('carrinho', JSON.stringify(itens), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
    });
  }

  @Get()
  ver(@Req() req: Request) {
    return this.lerCarrinho(req);
  }

  @Post('adicionar')
  adicionar(@Body() dto: AddItemCarrinhoDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const carrinho = this.lerCarrinho(req);
    const existente = carrinho.find((i) => i.produtoId === dto.produtoId);

    if (existente) {
      existente.quantidade += dto.quantidade;
    } else {
      carrinho.push({ produtoId: dto.produtoId, quantidade: dto.quantidade });
    }

    this.salvarCarrinho(res, carrinho);
    return carrinho;
  }

  @Delete('limpar')
  limpar(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('carrinho');
    return { message: 'Carrinho limpo' };
  }
}