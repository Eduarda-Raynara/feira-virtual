import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['concluido', 'cancelado'])
  status!: 'concluido' | 'cancelado';
}