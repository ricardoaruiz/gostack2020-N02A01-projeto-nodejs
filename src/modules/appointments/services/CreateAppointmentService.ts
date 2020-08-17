import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import { isBefore, startOfHour, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private chacheProvider: ICacheProvider,
  ) { }

  public async execute({
    provider,
    customer,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const now = new Date(Date.now());

    if (provider === customer) {
      throw new AppError("You Can't create an appointment with yourself");
    }

    const appointmentHour = date.getHours();

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError("You can't create appointment out of business hour");
    }

    if (isBefore(appointmentDate, now)) {
      throw new AppError("Yout can't create appointment in past date");
    }

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

    const formattedDate = format(date, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationsRepository.create({
      recipient_id: provider,
      content: `Novo agendamento para dia ${formattedDate}`,
    });

    await this.chacheProvider.invalidate(
      `provider-appointments:${provider}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return newAppointment;
  }
}
