import { Router, Request, Response } from 'express';
import { uuid } from 'uuidv4';

const appointmentsRouter = Router();

const appointments = [];

appointmentsRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body;

  const newAppointment = {
    id: uuid(),
    provider,
    date,
  };

  appointments.push(newAppointment);
  return response.json(newAppointment);
});

export default appointmentsRouter;
