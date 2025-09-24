import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@lianails.com',
    description: 'Email del usuario registrado'
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres' })
  email: string;

  @ApiProperty({ 
    example: 'MiPassword123!',
    description: 'Contraseña del usuario'
  })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(1, { message: 'La contraseña es requerida' })
  @MaxLength(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
  password: string;
}