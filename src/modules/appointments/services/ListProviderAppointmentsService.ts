import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
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
    // Busca do cache do Redis
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.chacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    // Se não estiver no cache busca do banco
    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );

      await this.chacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}
