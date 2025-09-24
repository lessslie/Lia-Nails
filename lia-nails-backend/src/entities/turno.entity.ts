import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  clientaId: string;


  @Column()
  empleadaId: string;


  @Column()
  servicioId: string;

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @Column()
  duracion: number; // minutos

  @Column({
    type: 'enum',
    enum: ['pendiente', 'confirmado', 'finalizado', 'cancelado', 'no_asistio'],
    default: 'pendiente',
  })
  estado: 'pendiente' | 'confirmado' | 'finalizado' | 'cancelado' | 'no_asistio';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  anticipoPagada: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPagado?: number;

  @Column({ nullable: true })
  metodoPagoanticipo?: string;

  @Column({ nullable: true })
  metodoPagoFinal?: string;

  @Column({ default: true })
  requiereanticipo: boolean;

  @Column({ default: false })
  recordatorioEnviado: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}