import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clientas')
export class Clienta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento?: string;

  @Column({ default: false })
  notificarCumpleanos: boolean;

  @Column({ default: false })
  clienteRegular: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}