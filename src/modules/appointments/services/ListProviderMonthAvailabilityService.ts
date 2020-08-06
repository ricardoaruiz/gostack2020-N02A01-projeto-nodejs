import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import { getDaysInMonth } from 'date-fns';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
    const eachDayArray = Array.from(
      { length: daysInMonth },
      (value, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => appointment.date.getDate() === day,
      );

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
