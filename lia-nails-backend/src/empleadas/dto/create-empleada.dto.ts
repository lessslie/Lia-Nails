import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, Matches, IsBoolean, IsOptional } from 'class-validator';

export class CreateEmpleadaDto {
  @ApiProperty({ example: 'María' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'González' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: '+54 9 11 1234-5678' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: 'maria@lianails.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] })
  @IsArray()
  @IsString({ each: true })
  diasLaborales: string[];

  @ApiProperty({ example: '09:30' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horaInicio: string;

  @ApiProperty({ example: '19:00' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horaFin: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}