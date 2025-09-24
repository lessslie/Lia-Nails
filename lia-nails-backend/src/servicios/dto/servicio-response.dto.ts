import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ServicioResponseDto {
  @ApiProperty({
    description: 'ID único del servicio',
    example: 'uuid-1234-5678',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Manicura Completa',
  })
  @Expose()
  nombre: string;

  @ApiProperty({
    description: 'Descripción del servicio',
    example: 'Manicura completa con esmaltado y diseño básico',
    nullable: true,
  })
  @Expose()
  descripcion: string | null;

  @ApiProperty({
    description: 'Precio del servicio',
    example: 15000,
  })
  @Expose()
  precio: number;

  @ApiProperty({
    description: 'Precio formateado con moneda',
    example: '$15.000',
  })
  @Expose()
 @Transform(({ obj }: { obj: { precio: number } }) => {
  const precio = obj.precio;
  return `$${precio.toLocaleString('es-AR')}`;
})
  precio_formateado: string;

  @ApiProperty({
    description: 'Duración en minutos',
    example: 90,
  })
  @Expose()
  duracion_minutos: number;

  @ApiProperty({
    description: 'Duración formateada',
    example: '1h 30min',
  })
  @Expose()
@Transform(({ obj }: { obj: { duracion_minutos: number } }) => {
  const minutos = obj.duracion_minutos;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (horas === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${horas}h`;
  } else {
    return `${horas}h ${mins}min`;
  }
})
  duracion_formateada: string;

  @ApiProperty({
    description: 'Categoría del servicio',
    example: 'manicura',
  })
  @Expose()
  categoria: string;

  @ApiProperty({
    description: 'Nombre formateado de la categoría',
    example: 'Manicura',
  })
  @Expose()
 @Transform(({ obj }: { obj: { categoria: string } }) => {
  const categorias: Record<string, string> = {
    'manicura': 'Manicura',
    'pedicura': 'Pedicura',
    'nail_art': 'Nail Art',
    'tratamientos': 'Tratamientos',
    'kapping': 'Kapping',
    'otros': 'Otros'
  };
  return categorias[obj.categoria] || obj.categoria;
})
  categoria_nombre: string;

  @ApiProperty({
    description: 'Estado del servicio',
    example: true,
  })
  @Expose()
  activo: boolean;

  @ApiProperty({
    description: 'Estado del servicio en texto',
    example: 'Activo',
  })
  @Expose()
  @Transform(({ obj }: { obj: { activo: boolean } }) => obj.activo ? 'Activo' : 'Inactivo')
  estado_texto: string;

  @ApiProperty({
    description: 'Orden de visualización',
    example: 1,
    nullable: true,
  })
  @Expose()
  orden: number | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  creado_en: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T15:45:00Z',
  })
  @Expose()
  actualizado_en: Date;
}