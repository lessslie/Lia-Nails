import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsUUID, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ 
    example: 'admin@lianails.com',
    description: 'Email del usuario (debe ser único)'
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres' })
  email: string;

  @ApiProperty({ 
    example: 'MiPassword123!',
    description: 'Contraseña (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas, números y símbolos)'
  })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo especial (@$!%*?&)' 
    }
  )
  password: string;

  @ApiProperty({ 
    enum: ['admin', 'empleada'],
    example: 'empleada',
    description: 'Rol del usuario en el sistema'
  })
  @IsEnum(['admin', 'empleada'], { message: 'El rol debe ser "admin" o "empleada"' })
  rol: 'admin' | 'empleada';

  @ApiProperty({ 
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la empleada (requerido solo si el rol es "empleada")'
  })
  @IsOptional()
  @IsUUID(4, { message: 'El empleadaId debe ser un UUID válido' })
  empleadaId?: string;
}