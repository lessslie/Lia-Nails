import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bloqueos_horario')
export class BloqueoHorario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  empleadaId: string;

  @Column({ type: 'date' })
  fechaInicio: string;

  @Column({ type: 'date', nullable: true })
  fechaFin?: string;

  @Column({ type: 'time', nullable: true })
  horaInicio?: string;

  @Column({ type: 'time', nullable: true })
  horaFin?: string;

  @Column()
  motivo: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}