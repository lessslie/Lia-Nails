import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, Min, Max, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateServicioDto {
  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Manicura Completa',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  @Transform(({ value }: { value: string }) => value?.trim() || null)
  nombre: string;

  @ApiProperty({
    description: 'Categoría del servicio',
    enum: ['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'],
    example: 'manicura',
  })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsEnum(['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'], {
    message: 'Categoría no válida. Opciones: manicura, pedicura, nail_art, tratamientos, kapping, otros',
  })
  categoria: 'manicura' | 'pedicura' | 'nail_art' | 'tratamientos' | 'kapping' | 'otros';

  @ApiProperty({
    description: 'Duración del servicio en minutos',
    example: 90,
    minimum: 15,
    maximum: 300,
  })
  @IsNotEmpty({ message: 'La duración es obligatoria' })
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @Min(15, { message: 'La duración mínima es 15 minutos' })
  @Max(300, { message: 'La duración máxima es 300 minutos (5 horas)' })
  duracion_minutos: number;

  @ApiProperty({
    description: 'Precio del servicio en pesos argentinos',
    example: 15000,
    minimum: 1000,
    maximum: 100000,
  })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(1000, { message: 'El precio mínimo es $1.000' })
  @Max(100000, { message: 'El precio máximo es $100.000' })
  precio: number;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Manicura completa con limado, cutícula, esmaltado y diseño básico',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'La descripción no puede superar los 500 caracteres' })
  @Transform(({ value }: { value: string }) => value?.trim() || null)
  descripcion?: string;

  @ApiProperty({
    description: 'Orden de visualización del servicio',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  @Min(1, { message: 'El orden mínimo es 1' })
  orden?: number;
}