import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidosController {
  constructor(private pedidosService: PedidosService) {}

  @Post()
  @Roles('cliente')
  create(@Body() dto: CreatePedidoDto, @Req() req: any) {
    return this.pedidosService.create(dto, req.user.userId);
  }

  @Get('meus')
  @Roles('cliente')
  findMeus(@Req() req: any) {
    return this.pedidosService.findMeusPedidos(req.user.userId);
  }

  @Get()
  @Roles('vendedor')
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto, @Req() req: any) {
    return this.pedidosService.updateStatus(id, dto, req.user.userId, req.user.role);
  }
}