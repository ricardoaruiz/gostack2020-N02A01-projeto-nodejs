import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);
    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );

    const newAppointment = await createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.json(newAppointment);
  }
}
