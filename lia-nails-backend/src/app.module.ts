import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos de la aplicación
import { AuthModule } from './auth/auth.module';
import { EmpleadasModule } from './empleadas/empleadas.module';
import { ServiciosModule } from './servicios/servicios.module';

// Entidades
import { Usuario } from './entities/usuario.entity';
import { Empleada } from './entities/empleada.entity';
import { Servicio } from './entities/servicio.entity';
import { ServicioEmpleada } from './entities/servicio-empleada.entity';
import { Clienta } from './entities/clienta.entity';
import { Turno } from './entities/turno.entity';
import { Pago } from './entities/pago.entity';
import { ObservacionClienta } from './entities/observacion-clienta.entity';
import { BloqueoHorario } from './entities/bloqueo-horario.entity';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
      envFilePath: '.env', // Archivo de variables de entorno
    }),

    // Configuración de TypeORM/PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'lia_nails',
      entities: [
        // Registrar todas las entidades
        Usuario,
        Empleada,
        Servicio,
        ServicioEmpleada,
        Clienta,
        Turno,
        Pago,
        ObservacionClienta,
        BloqueoHorario,
      ],
      synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
      logging: process.env.NODE_ENV === 'development', // Logs SQL en desarrollo
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),

    // Módulos de funcionalidades
    AuthModule,
    EmpleadasModule,
    ServiciosModule,
    
    // TODO: Agregar otros módulos conforme se implementen
    // ClientasModule,
    // TurnosModule,
    // PagosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}