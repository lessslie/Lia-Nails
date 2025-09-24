import { IsOptional, IsString, IsBoolean, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class ServicioQueryDto {
  @ApiProperty({
    description: 'Buscar por nombre del servicio',
    required: false,
    example: 'manicura',
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser un texto' })
  buscar?: string;

  @ApiProperty({
    description: 'Filtrar por categoría',
    required: false,
    enum: ['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'],
    example: 'manicura',
  })
  @IsOptional()
  @IsEnum(['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'], {
    message: 'Categoría no válida',
  })
  categoria?: 'manicura' | 'pedicura' | 'nail_art' | 'tratamientos' | 'kapping' | 'otros';

  @ApiProperty({
    description: 'Filtrar por estado activo',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return typeof value === 'boolean' ? value : undefined;
  })
  @IsBoolean({ message: 'El campo activo debe ser true o false' })
  activo?: boolean;

  @ApiProperty({
    description: 'Precio mínimo',
    required: false,
    minimum: 0,
    example: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  @Min(0, { message: 'El precio mínimo no puede ser negativo' })
  precio_min?: number;

  @ApiProperty({
    description: 'Precio máximo',
    required: false,
    minimum: 0,
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  @Min(0, { message: 'El precio máximo no puede ser negativo' })
  precio_max?: number;

  @ApiProperty({
    description: 'Duración mínima en minutos',
    required: false,
    minimum: 0,
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración mínima debe ser un número' })
  @Min(0, { message: 'La duración mínima no puede ser negativa' })
  duracion_min?: number;

  @ApiProperty({
    description: 'Duración máxima en minutos',
    required: false,
    minimum: 0,
    example: 120,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración máxima debe ser un número' })
  @Min(0, { message: 'La duración máxima no puede ser negativa' })
  duracion_max?: number;

  @ApiProperty({
    description: 'Campo por el cual ordenar',
    required: false,
    enum: ['nombre', 'precio', 'duracion_minutos', 'categoria', 'orden', 'creado_en'],
    example: 'nombre',
  })
  @IsOptional()
  @IsEnum(['nombre', 'precio', 'duracion_minutos', 'categoria', 'orden', 'creado_en'], {
    message: 'Campo de ordenamiento no válido',
  })
  ordenar_por?: 'nombre' | 'precio' | 'duracion_minutos' | 'categoria' | 'orden' | 'creado_en';

  @ApiProperty({
    description: 'Dirección del ordenamiento',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message: 'Dirección de ordenamiento no válida. Usar ASC o DESC',
  })
  direccion?: 'ASC' | 'DESC';

  @ApiProperty({
    description: 'Número de página',
    required: false,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El número de página debe ser un número' })
  @Min(1, { message: 'El número de página debe ser mayor a 0' })
  pagina?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    required: false,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  limite?: number = 10;
}