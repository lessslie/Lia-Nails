import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

import { ServiciosService, ServiciosPaginados } from './servicios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { ServicioResponseDto } from './dto/servicio-response.dto';
import { ServicioQueryDto } from './dto/servicio-query.dto';

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
    description: 'Datos del servicio a crear',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Servicio creado exitosamente',
    type: ServicioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o servicio ya existente',
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
    summary: 'Listar servicios',
    description: 'Obtiene una lista paginada de servicios con filtros opcionales.',
  })
  @ApiQuery({ name: 'buscar', required: false, description: 'Buscar por nombre del servicio' })
  @ApiQuery({ name: 'categoria', required: false, enum: ['manicura', 'pedicura', 'nail_art', 'tratamientos', 'kapping', 'otros'] })
  @ApiQuery({ name: 'activo', required: false, type: Boolean })
  @ApiQuery({ name: 'precio_min', required: false, type: Number })
  @ApiQuery({ name: 'precio_max', required: false, type: Number })
  @ApiQuery({ name: 'duracion_min', required: false, type: Number })
  @ApiQuery({ name: 'duracion_max', required: false, type: Number })
  @ApiQuery({ name: 'ordenar_por', required: false, enum: ['nombre', 'precio', 'duracion_minutos', 'categoria', 'orden', 'creado_en'] })
  @ApiQuery({ name: 'direccion', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'pagina', required: false, type: Number })
  @ApiQuery({ name: 'limite', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de servicios obtenida exitosamente',
  })
  async buscarTodos(
    @Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    query: ServicioQueryDto,
  ): Promise<ServiciosPaginados> {
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
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio encontrado exitosamente',
    type: ServicioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Servicio no encontrado',
  })
  async buscarPorId(@Param('id') id: string): Promise<ServicioResponseDto> {
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
    description: 'ID único del servicio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateServicioDto,
    description: 'Datos a actualizar del servicio',
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT inválido o faltante',
  })
  async actualizar(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateServicioDto: UpdateServicioDto,
  ): Promise<ServicioResponseDto> {
    return await this.serviciosService.actualizar(id, updateServicioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Desactivar servicio',
    description: 'Desactiva un servicio (soft delete). Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del servicio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio desactivado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Servicio no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT inválido o faltante',
  })
  async eliminar(@Param('id') id: string): Promise<{ mensaje: string }> {
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
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicios de la categoría obtenidos exitosamente',
  })
  async buscarPorCategoria(
    @Param('categoria') categoria: 'manicura' | 'pedicura' | 'nail_art' | 'tratamientos' | 'kapping' | 'otros',
  ): Promise<ServiciosPaginados> {
    const query: ServicioQueryDto = {
      categoria: categoria,
      activo: true,
      ordenar_por: 'orden',
      direccion: 'ASC',
      limite: 100,
    };
    
    return await this.serviciosService.buscarTodos(query);
  }
}