import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import { getRepository, Repository, Between } from 'typeorm';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import { lastDayOfMonth } from 'date-fns';

export default class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  find(): Promise<Appointment[]> {
    return this.ormRepository.find();
  }

  public async create({
    providerId,
    customerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    // Cria uma entidade do typeORM mas não salvou na base ainda
    const newAppointment = this.ormRepository.create({
      providerId,
      customerId,
      date,
    });
    // Salva a entidade criada no banco de dados
    await this.ormRepository.save(newAppointment);

    return newAppointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = await this.ormRepository.findOne({
      where: { date },
    });
    return foundAppointment;
  }

  public async findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]> {
    const initialDate = new Date(
      Date.UTC(data.year, data.month - 1, 1, 0, 0, 0, 0),
    );
    const endDate = new Date(
      Date.UTC(
        data.year,
        data.month - 1,
        lastDayOfMonth(initialDate).getDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const appointments = await this.ormRepository.find({
      where: {
        providerId: data.provider_id,
        date: Between(initialDate, endDate),
      },
    });

    return appointments;
  }

  async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]> {
    const initialDate = new Date(
      Date.UTC(data.year, data.month - 1, data.day, 0, 0, 0, 0),
    );
    const endDate = new Date(
      Date.UTC(data.year, data.month - 1, data.day, 23, 59, 59, 999),
    );

    const appointments = await this.ormRepository.find({
      where: {
        providerId: data.provider_id,
        date: Between(initialDate, endDate),
      },
    });

    return appointments;
  }
}
