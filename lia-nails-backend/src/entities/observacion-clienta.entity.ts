import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('observaciones_clienta')
export class ObservacionClienta {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  clientaId: string;


  @Column()
  empleadaId: string;

  @Column('text')
  observacion: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}