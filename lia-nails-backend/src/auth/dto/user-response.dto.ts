import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único del usuario'
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'admin@lianails.com',
    description: 'Email del usuario'
  })
  @Expose()
  email: string;

  @ApiProperty({
    enum: ['admin', 'empleada'],
    example: 'empleada',
    description: 'Rol del usuario'
  })
  @Expose()
  rol: 'admin' | 'empleada';

  @ApiProperty({
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la empleada asociada (si aplica)'
  })
  @Expose()
  empleadaId?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Fecha de creación del usuario'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Fecha de última actualización'
  })
  @Expose()
  updatedAt: Date;
}