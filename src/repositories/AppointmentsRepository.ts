import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

export default class AppointmentsRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public all(): Appointment[] {
    return this.appointments;
  }

  public create(provider: string, date: Date): Appointment {
    const newAppointment = new Appointment(provider, date);
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public findByDate(date: Date): Appointment | null {
    const foundAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );

    return foundAppointment || null;
  }
}
