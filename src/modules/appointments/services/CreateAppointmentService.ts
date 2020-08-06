import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import AppError from '@shared/errors/AppError';
import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  provider: string;
  customer: string;
  date: Date;
}

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({
    provider,
    customer,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // Cria uma entidade do typeORM mas não salvou na base ainda
    const newAppointment = await this.appointmentsRepository.create({
      providerId: provider,
      customerId: customer,
      date: appointmentDate,
    });

    return newAppointment;
  }
}
