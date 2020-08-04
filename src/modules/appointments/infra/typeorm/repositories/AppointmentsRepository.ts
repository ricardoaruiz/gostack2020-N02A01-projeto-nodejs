import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import { getRepository, Repository } from 'typeorm';

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
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    // Cria uma entidade do typeORM mas não salvou na base ainda
    const newAppointment = this.ormRepository.create({
      providerId,
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
}
