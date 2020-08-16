import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { inject, injectable } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private chacheProvider: ICacheProvider,
  ) { }

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    await this.chacheProvider.save('teste', 'Valor no redis');

    return appointments;
  }
}
