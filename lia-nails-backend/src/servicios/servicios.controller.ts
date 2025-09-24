import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { ServiciosService } from './servicios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateServicioDto,
  UpdateServicioDto,
  ServicioResponseDto,
  ServicioQueryDto,
} from './dto';

@ApiTags('Servicios')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear nuevo servicio',
    description: 'Crea un nuevo servicio en el sistema. Requiere autenticación JWT.',
  })
  @ApiBody({
    type: CreateServicioDto,
    description: 'Datos del nuevo servicio',
    examples: {
      manicura: {
        summary: 'Ejemplo Manicura',
        value: {
          nombre: 'Manicura Completa',
          descripcion: 'Manicura completa con esmaltado, incluye limado, cutícula y masaje',
          precio: 15000,
          duracion_minutos: 90,
          categoria: 'manicura',
          imagen_url: 'https://example.com/manicura.jpg',
          activo: true,
          orden: 1,
        },
      },
      pedicura: {
        summary: 'Ejemplo Pedicura',
        value: {
          nombre: 'Pedicura Spa',
          descripcion: 'Pedicura completa con exfoliación y masaje relajante',
          precio: 18000,
          duracion_minutos: 120,
          categoria: 'pedicura',
          activo: true,
          orden: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Servicio creado exitosamente',
    type: ServicioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o error de validación',
    schema: {
      example: {
        statusCode: 400,
        message: ['El nombre debe tener entre 2 y 100 caracteres'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un servicio con el mismo nombre',
    schema: {
      example: {
        statusCode: 409,
        message: 'Ya existe un servicio con el nombre "Manicura Completa"',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT inválido o faltante',
  })
  async crear(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createServicioDto: CreateServicioDto,
  ): Promise<ServicioResponseDto> {
    return await this.serviciosService.crear(createServicioDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los servicios',
    description: 'Obtiene una lista paginada de servicios con filtros opcionales.',
  })
  @ApiQuery({
    name: 'buscar',
    required: false,
    description: 'Buscar por nombre del servicio',
    example: 'manicura',
  })
  @ApiQuery({
    name: 'categoria',
    required: false,
    description: 'Filtrar por categoría',
    enum: ['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'],
  })
  @ApiQuery({
    name: 'activo',
    required: false,
    description: 'Filtrar por estado activo',
    type: Boolean,
  })
  @ApiQuery({
    name: 'precio_min',
    required: false,
    description: 'Precio mínimo',
    type: Number,
  })
  @ApiQuery({
    name: 'precio_max',
    required: false,
    description: 'Precio máximo',
    type: Number,
  })
  @ApiQuery({
    name: 'duracion_min',
    required: false,
    description: 'Duración mínima en minutos',
    type: Number,
  })
  @ApiQuery({
    name: 'duracion_max',
    required: false,
    description: 'Duración máxima en minutos',
    type: Number,
  })
  @ApiQuery({
    name: 'ordenar_por',
    required: false,
    description: 'Campo por el cual ordenar',
    enum: ['nombre', 'precio', 'duracion_minutos', 'categoria', 'orden', 'creado_en'],
  })
  @ApiQuery({
    name: 'direccion',
    required: false,
    description: 'Dirección del ordenamiento',
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'pagina',
    required: false,
    description: 'Número de página',
    type: Number,
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    description: 'Cantidad de elementos por página',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de servicios obtenida exitosamente',
    schema: {
      example: {
        servicios: [
          {
            id: 1,
            nombre: 'Manicura Completa',
            descripcion: 'Manicura completa con esmaltado',
            precio: 15000,
            precio_formateado: '$15.000',
            duracion_minutos: 90,
            duracion_formateada: '1h 30min',
            categoria: 'manicura',
            categoria_nombre: 'Manicura',
            activo: true,
            estado_texto: 'Activo',
            orden: 1,
            creado_en: '2024-01-15T10:30:00Z',
            actualizado_en: '2024-01-15T15:45:00Z',
          },
        ],
        total: 15,
        pagina: 1,
        limite: 10,
        total_paginas: 2,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parámetros de consulta inválidos',
  })
  async buscarTodos(
    @Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    query: ServicioQueryDto,
  ) {
    return await this.serviciosService.buscarTodos(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener servicio por ID',
    description: 'Obtiene los detalles de un servicio específico por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del servicio',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio encontrado exitosamente',
    type: ServicioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Servicio no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Servicio con ID 999 no encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido',
    schema: {
      example: {
        statusCode: 400,
        message: 'ID de servicio inválido',
        error: 'Bad Request',
      },
    },
  })
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServicioResponseDto> {
    return await this.serviciosService.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar servicio',
    description: 'Actualiza los datos de un servicio existente. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del servicio a actualizar',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateServicioDto,
    description: 'Datos a actualizar del servicio',
    examples: {
      precio: {
        summary: 'Actualizar solo precio',
        value: {
          precio: 16000,
        },
      },
      completo: {
        summary: 'Actualización completa',
        value: {
          nombre: 'Manicura Premium',
          descripcion: 'Manicura completa premium con tratamiento especial',
          precio: 20000,
          duracion_minutos: 105,
          activo: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio actualizado exitosamente',
    type: ServicioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Servicio no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe otro servicio con el mismo nombre',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT inválido o faltante',
  })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateServicioDto: UpdateServicioDto,
  ): Promise<ServicioResponseDto> {
    return await this.serviciosService.actualizar(id, updateServicioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar servicio',
    description: 'Desactiva un servicio (soft delete). El servicio no se elimina físicamente sino que se marca como inactivo. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del servicio a eliminar',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio desactivado exitosamente',
    schema: {
      example: {
        mensaje: 'Servicio "Manicura Completa" desactivado correctamente',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Servicio no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT inválido o faltante',
  })
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
    return await this.serviciosService.eliminar(id);
  }

  @Get('categoria/:categoria')
  @ApiOperation({
    summary: 'Obtener servicios por categoría',
    description: 'Obtiene todos los servicios activos de una categoría específica.',
  })
  @ApiParam({
    name: 'categoria',
    description: 'Categoría de servicios',
    enum: ['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'],
    example: 'manicura',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicios de la categoría obtenidos exitosamente',
  })
  async buscarPorCategoria(
    @Param('categoria') categoria: string,
  ) {
    const query: ServicioQueryDto = {
      categoria,
      activo: true,
      ordenar_por: 'orden',
      direccion: 'ASC',
      limite: 100, // Traer todos los servicios de la categoría
    };
    
    return await this.serviciosService.buscarTodos(query);
  }
}