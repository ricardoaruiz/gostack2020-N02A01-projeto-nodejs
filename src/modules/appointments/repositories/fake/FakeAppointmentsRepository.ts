import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import { uuid } from 'uuidv4';

export default class FakeAppointmentsRepository
  implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  constructor() { }

  find(): Promise<Appointment[]> {
    return Promise.resolve([]);
  }

  public async create({
    providerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment();
    Object.assign(newAppointment, { id: uuid(), providerId, date });
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = this.appointments.find(
      appointment => appointment.date === date,
    );
    return foundAppointment;
  }
}
