import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import { getDate, getMonth, getYear } from 'date-fns';
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
    customerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment();
    Object.assign(newAppointment, { id: uuid(), providerId, customerId, date });
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public async findByDate(
    date: Date,
    providerId: string,
  ): Promise<Appointment | undefined> {
    const foundAppointment = this.appointments.find(
      appointment =>
        appointment.date === date && appointment.providerId === providerId,
    );
    return foundAppointment;
  }

  public async findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerId === data.provider_id &&
        getMonth(appointment.date) + 1 === data.month &&
        getYear(appointment.date) === data.year,
    );

    return appointments;
  }

  async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerId === data.provider_id &&
        getDate(appointment.date) === data.day &&
        getMonth(appointment.date) + 1 === data.month &&
        getYear(appointment.date) === data.year,
    );

    return appointments;
  }
}
