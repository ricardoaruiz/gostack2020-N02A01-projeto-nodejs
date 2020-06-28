import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

// Adicionando o middleware de veriticação de autenticação em
// todas as rotas de appointments
appointmentsRouter.use(ensureAuthenticated);

/**
 * Rota de listagem de appointments
 */
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});

/**
 * Rota de criação de appointments
 */
appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);
    const createAppointmentService = new CreateAppointmentService();

    const newAppointment = await createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.json(newAppointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;
