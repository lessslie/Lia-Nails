import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';
import { Servicio } from '../../entities/servicio.entity';

@Module({
  imports: [
    // Registrar la entidad Servicio para este módulo
    TypeOrmModule.forFeature([Servicio]),
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
  exports: [
    // Exportamos el service para que otros módulos puedan usarlo
    ServiciosService,
    // También exportamos TypeOrmModule por si otros módulos necesitan el repository
    TypeOrmModule,
  ],
})
export class ServiciosModule {}