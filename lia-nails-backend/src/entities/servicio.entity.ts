import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: ['uñas', 'pies', 'pestañas'],
  })
  categoria: 'uñas' | 'pies' | 'pestañas';

  @Column({ nullable: true })
  subtipo?: string; // Para uñas: 'esmalte-tradicional', 'semipermanente', etc.

  @Column()
  duracionDefault: number; // minutos

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activo: boolean;



  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}