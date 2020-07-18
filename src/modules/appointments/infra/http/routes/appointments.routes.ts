import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { parseISO } from 'date-fns';
import { Router } from 'express';

const appointmentsRouter = Router();

// Adicionando o middleware de veriticação de autenticação em
// todas as rotas de appointments
appointmentsRouter.use(ensureAuthenticated);

/**
 * Rota de listagem de appointments
 */
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository: IAppointmentsRepository = new AppointmentsRepository();
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});

/**
 * Rota de criação de appointments
 */
appointmentsRouter.post('/', async (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const appointmentsRepository: IAppointmentsRepository = new AppointmentsRepository();
  const createAppointmentService = new CreateAppointmentService(
    appointmentsRepository,
  );

  const newAppointment = await createAppointmentService.execute({
    provider,
    date: parsedDate,
  });

  return response.json(newAppointment);
});

export default appointmentsRouter;
