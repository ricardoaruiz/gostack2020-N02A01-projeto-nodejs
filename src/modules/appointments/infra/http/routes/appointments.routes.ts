import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

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
appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
