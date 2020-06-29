import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface Request {
  provider: string;
  date: Date;
}

export default class CreateAppointmentService {
  private appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // Cria uma entidade do typeORM mas não salvou na base ainda
    const newAppointment = this.appointmentsRepository.create({
      providerId: provider,
      date: appointmentDate,
    });

    // Salva a entidade criada no banco de dados
    await this.appointmentsRepository.save(newAppointment);

    return newAppointment;
  }
}
