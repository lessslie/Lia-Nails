import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, Matches, IsBoolean, IsOptional } from 'class-validator';

export class UpdateEmpleadaDto {
  @ApiProperty({ example: 'María', required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'González', required: false })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiProperty({ example: '+54 9 11 1234-5678', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'maria@lianails.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: ['lunes', 'martes'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diasLaborales?: string[];

  @ApiProperty({ example: '09:30', required: false })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horaInicio?: string;

  @ApiProperty({ example: '19:00', required: false })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horaFin?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}