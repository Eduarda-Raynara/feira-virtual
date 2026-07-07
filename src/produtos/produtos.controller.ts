import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, Req,
  ParseIntPipe, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('produtos')
export class ProdutosController {
  constructor(private produtosService: ProdutosService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.produtosService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @UseInterceptors(FileInterceptor('imagem', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const nomeSeguro = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, nomeSeguro);
      },
    }),
    fileFilter: (req, file, cb) => {
      const tiposPermitidos = /jpg|jpeg|png|webp/;
      const ok = tiposPermitidos.test(extname(file.originalname).toLowerCase());
      if (!ok) return cb(new BadRequestException('Tipo de arquivo não permitido'), false);
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  create(
    @Body() dto: CreateProdutoDto,
    @Req() req: any,
    @UploadedFile() imagem?: Express.Multer.File,
  ) {
    return this.produtosService.create(dto, req.user.userId, imagem?.filename);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  update(@Param('id') id: string, @Body() dto: UpdateProdutoDto, @Req() req: any) {
    return this.produtosService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.produtosService.remove(id, req.user.userId);
  }
}