import { IsEmail, IsString, IsIn, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsString() nome!: string;
  @IsIn(['cliente', 'vendedor']) role!: 'cliente' | 'vendedor';
}