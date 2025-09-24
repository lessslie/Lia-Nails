import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  turnoId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column()
  metodo: string; // 'efectivo', 'transferencia', 'debito', 'credito', 'mercado_pago'

  @Column({ nullable: true })
  comprobante?: string;

  @Column({
    type: 'enum',
    enum: ['anticipo', 'completo'],
  })
  tipo: 'anticipo' | 'completo';

  @CreateDateColumn()
  fechaPago: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}