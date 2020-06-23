import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

/**
 * Rota de listagem de appointments
 */
appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();
  return response.json(appointments);
});

/**
 * Rota de criação de appointments
 */
appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService(
      appointmentsRepository,
    );

    const newAppointment = createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.json(newAppointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;
