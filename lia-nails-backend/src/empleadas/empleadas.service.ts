import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleada } from '../entities/empleada.entity';
import { CreateEmpleadaDto } from './dto/create-empleada.dto';
import { UpdateEmpleadaDto } from './dto/update-empleada.dto';
import { EmpleadaResponse } from './interfaces/empleada-response.interface';
import { EmpleadaListResponse } from './interfaces/empleada-list.interface';

@Injectable()
export class EmpleadasService {
  constructor(
    @InjectRepository(Empleada)
    private empleadasRepository: Repository<Empleada>,
  ) {}

  async create(createEmpleadaDto: CreateEmpleadaDto): Promise<EmpleadaResponse> {
    const empleada = this.empleadasRepository.create(createEmpleadaDto);
    const savedEmpleada = await this.empleadasRepository.save(empleada);
    return savedEmpleada;
  }

  async findAll(): Promise<EmpleadaListResponse> {
    const empleadas = await this.empleadasRepository.find({
      where: { activa: true }
    });

    return {
      empleadas,
      total: empleadas.length
    };
  }

  async findOne(id: string): Promise<EmpleadaResponse> {
    const empleada = await this.empleadasRepository.findOne({
      where: { id }
    });

    if (!empleada) {
      throw new NotFoundException(`Empleada con ID ${id} no encontrada`);
    }

    return empleada;
  }

  async update(id: string, updateData: UpdateEmpleadaDto): Promise<EmpleadaResponse> {
    await this.empleadasRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.empleadasRepository.update(id, { activa: false });
  }
}