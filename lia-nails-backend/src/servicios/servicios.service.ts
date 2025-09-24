import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindManyOptions } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Servicio } from '../entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { ServicioResponseDto } from './dto/servicio-response.dto';
import { ServicioQueryDto } from './dto/servicio-query.dto';

export interface ServiciosPaginados {
  servicios: ServicioResponseDto[];
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
}

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  /**
   * Crear un nuevo servicio
   */
  async crear(createServicioDto: CreateServicioDto): Promise<ServicioResponseDto> {
    // Verificar si ya existe un servicio con el mismo nombre
    const servicioExistente = await this.servicioRepository.findOne({
      where: { 
        nombre: createServicioDto.nombre.trim(),
      },
    });

    if (servicioExistente) {
      throw new ConflictException(`Ya existe un servicio con el nombre "${createServicioDto.nombre}"`);
    }

    // Validar que el precio y duración sean coherentes
    this.validarDatosServicio(createServicioDto);

    try {
      // Crear la entidad
      const nuevoServicio = this.servicioRepository.create({
        ...createServicioDto,
        nombre: createServicioDto.nombre.trim(),
        descripcion: createServicioDto.descripcion?.trim(),
      });

      // Guardar en la base de datos
      const servicioGuardado = await this.servicioRepository.save(nuevoServicio);

      // Convertir y devolver como DTO de respuesta
      return plainToInstance(ServicioResponseDto, servicioGuardado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  throw new BadRequestException(`Error al crear el servicio: ${errorMessage}`);
}
  }

  /**
   * Buscar todos los servicios con filtros y paginación
   */
  async buscarTodos(query: ServicioQueryDto): Promise<ServiciosPaginados> {
    const { 
      buscar, 
      categoria, 
      activo, 
      precio_min, 
      precio_max, 
      duracion_min, 
      duracion_max,
      ordenar_por, 
      direccion, 
      pagina, 
      limite 
    } = query;

    // Construir las condiciones de búsqueda
    const whereConditions: Record<string, unknown> = {};

    // Filtro por texto de búsqueda (nombre o descripción)
    if (buscar) {
      // En TypeORM, para búsqueda en múltiples campos necesitamos usar queryBuilder
      // Por ahora buscamos solo en nombre
      whereConditions.nombre = Like(`%${buscar}%`);
    }

    // Filtro por categoría
    if (categoria) {
      whereConditions.categoria = categoria;
    }

    // Filtro por estado activo
    if (activo !== undefined) {
      whereConditions.activo = activo;
    }

    // Filtros por rango de precios
    if (precio_min !== undefined && precio_max !== undefined) {
      whereConditions.precio = Between(precio_min, precio_max);
    } else if (precio_min !== undefined) {
      whereConditions.precio = Between(precio_min, 999999);
    } else if (precio_max !== undefined) {
      whereConditions.precio = Between(0, precio_max);
    }

    // Filtros por duración (similar a precios)
    if (duracion_min !== undefined && duracion_max !== undefined) {
      whereConditions.duracion_minutos = Between(duracion_min, duracion_max);
    } else if (duracion_min !== undefined) {
      whereConditions.duracion_minutos = Between(duracion_min, 480);
    } else if (duracion_max !== undefined) {
      whereConditions.duracion_minutos = Between(0, duracion_max);
    }

    // Configurar opciones de búsqueda
    const findOptions: FindManyOptions<Servicio> = {
      where: whereConditions,
      order: {
        [ordenar_por || 'orden']: direccion || 'ASC',
      },
      skip: ((pagina || 1) - 1) * (limite || 10),
      take: limite || 10,
    };

    try {
      // Ejecutar búsqueda con conteo total
      const [servicios, total] = await this.servicioRepository.findAndCount(findOptions);

      // Convertir a DTOs de respuesta
      const serviciosResponse = servicios.map(servicio => 
        plainToInstance(ServicioResponseDto, servicio, {
          excludeExtraneousValues: true,
        })
      );

      // Calcular datos de paginación
      const paginaActual = pagina || 1;
      const limiteActual = limite || 10;
      const totalPaginas = Math.ceil(total / limiteActual);

      return {
        servicios: serviciosResponse,
        total,
        pagina: paginaActual,
        limite: limiteActual,
        total_paginas: totalPaginas,
      };
    } catch (error:unknown) {
      throw new BadRequestException(
        `Error al buscar servicios: ${
          error && typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
            ? (error as { message: string }).message
            : String(error)
        }`
      );
    }
  }

  /**
   * Buscar un servicio por ID
   */
  async buscarPorId(id: string): Promise<ServicioResponseDto> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID de servicio inválido');
    }

    const servicio = await this.servicioRepository.findOne({
      where: { id },
    });

    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    return plainToInstance(ServicioResponseDto, servicio, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Actualizar un servicio
   */
  async actualizar(id: string, updateServicioDto: UpdateServicioDto): Promise<ServicioResponseDto> {
    // Buscar el servicio existente
    const servicioExistente = await this.servicioRepository.findOne({
      where: { id },
    });

    if (!servicioExistente) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateServicioDto.nombre) {
      const servicioConMismoNombre = await this.servicioRepository.findOne({
        where: { 
          nombre: updateServicioDto.nombre.trim(),
        },
      });

      if (servicioConMismoNombre && servicioConMismoNombre.id !== id) {
        throw new ConflictException(`Ya existe otro servicio con el nombre "${updateServicioDto.nombre}"`);
      }
    }

    // Validar datos si se están actualizando
    if (updateServicioDto.precio || updateServicioDto.duracion_minutos) {
      this.validarDatosServicio({
        ...servicioExistente,
        ...updateServicioDto,
      });
    }

    try {
      // Preparar datos para actualización
      const datosActualizacion: Partial<Servicio> = {
        ...updateServicioDto,
      };

      // Limpiar strings si existen
      if (updateServicioDto.nombre) {
        datosActualizacion.nombre = updateServicioDto.nombre.trim();
      }
      if (updateServicioDto.descripcion) {
        datosActualizacion.descripcion = updateServicioDto.descripcion.trim();
      }

      // Actualizar
      await this.servicioRepository.update(id, datosActualizacion);

      // Buscar y devolver el servicio actualizado
      const servicioActualizado = await this.servicioRepository.findOne({
        where: { id },
      });

      return plainToInstance(ServicioResponseDto, servicioActualizado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Error al actualizar el servicio: ${errorMessage}`);
    }
  }

  /**
   * Eliminar un servicio (soft delete)
   */
  async eliminar(id: string): Promise<{ mensaje: string }> {
    const servicio = await this.servicioRepository.findOne({
      where: { id },
    });

    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    try {
      // En lugar de eliminar físicamente, marcamos como inactivo
      await this.servicioRepository.update(id, { activo: false });

      return {
        mensaje: `Servicio "${servicio.nombre}" desactivado correctamente`,
      };
    } catch (error) {
      throw new BadRequestException(`Error al eliminar el servicio: ${error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : String(error)}`);
    }
  }

  /**
   * Validaciones de negocio para servicios
   */
  private validarDatosServicio(datos: Partial<CreateServicioDto | UpdateServicioDto>): void {
    // Validar categorías permitidas
    const categoriasPermitidas = ['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'];
    if (datos.categoria && !categoriasPermitidas.includes(datos.categoria)) {
      throw new BadRequestException(`Categoría "${datos.categoria}" no válida. Categorías permitidas: ${categoriasPermitidas.join(', ')}`);
    }

    // Validar coherencia precio-duración (servicios muy baratos no deberían durar mucho)
    if (datos.precio && datos.duracion_minutos) {
      const precioPorMinuto = datos.precio / datos.duracion_minutos;
      
      if (precioPorMinuto < 50) {
        throw new BadRequestException('El precio por minuto parece muy bajo. Revisa el precio y la duración.');
      }
      
      if (precioPorMinuto > 1000) {
        throw new BadRequestException('El precio por minuto parece muy alto. Revisa el precio y la duración.');
      }
    }
  }
}