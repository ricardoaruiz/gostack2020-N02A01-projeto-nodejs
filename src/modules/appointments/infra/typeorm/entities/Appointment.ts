import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
export default class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Representa a coluna no banco
  @Column({ name: 'provider_id' })
  providerId: string;

  // Representa somente o relacionamento para o typeorm
  @ManyToMany(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  // Representa a coluna no banco
  @Column({ name: 'customer_id' })
  customerId: string;

  // Representa somente o relacionamento para o typeorm
  @ManyToMany(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  // Observar que nem todos os bancos tem suporte a esse tipo de dado
  // se não tiver utilizar somente timestamp
  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
