import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmpleadasService } from './empleadas.service';
import { CreateEmpleadaDto } from './dto/create-empleada.dto';
import { UpdateEmpleadaDto } from './dto/update-empleada.dto';
import type { EmpleadaResponse } from './interfaces/empleada-response.interface';
import type { EmpleadaListResponse } from './interfaces/empleada-list.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Empleadas')
@Controller('empleadas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmpleadasController {
  constructor(private readonly empleadasService: EmpleadasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva empleada' })
  create(@Body() createEmpleadaDto: CreateEmpleadaDto): Promise<EmpleadaResponse> {
    return this.empleadasService.create(createEmpleadaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las empleadas activas' })
  findAll(): Promise<EmpleadaListResponse> {
    return this.empleadasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empleada por ID' })
  findOne(@Param('id') id: string): Promise<EmpleadaResponse> {
    return this.empleadasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar empleada' })
  update(@Param('id') id: string, @Body() updateEmpleadaDto: UpdateEmpleadaDto): Promise<EmpleadaResponse> {
    return this.empleadasService.update(id, updateEmpleadaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar empleada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.empleadasService.remove(id);
  }
}