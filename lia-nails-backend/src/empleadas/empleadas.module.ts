import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadasService } from './empleadas.service';
import { EmpleadasController } from './empleadas.controller';
import { Empleada } from '../entities/empleada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleada])],
  controllers: [EmpleadasController],
  providers: [EmpleadasService],
  exports: [EmpleadasService],
})
export class EmpleadasModule {}
