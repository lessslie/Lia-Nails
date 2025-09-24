import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('servicio_empleada')
export class ServicioEmpleada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  empleadaId: string;


  @Column()
  servicioId: string;

  @Column()
  duracionPersonalizada: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}