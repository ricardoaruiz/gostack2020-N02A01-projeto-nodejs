import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
export default class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  // Observar que nem todos os bancos tem suporte a esse tipo de dado
  // se não tiver utilizar somente timestamp
  @Column('timestamp with time zone')
  date: Date;
}
