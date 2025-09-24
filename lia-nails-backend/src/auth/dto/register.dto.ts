import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsUUID, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin@lianails.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  

  @ApiProperty({ enum: ['admin', 'empleada'] })
  @IsEnum(['admin', 'empleada'])
  rol: 'admin' | 'empleada';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  empleadaId?: string;
}