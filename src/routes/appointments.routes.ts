import { Router, Request, Response } from 'express';
import { uuid } from 'uuidv4';
import { startOfHour, parseISO, isEqual } from 'date-fns';

const appointmentsRouter = Router();

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body;
  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointments.find(appointment =>
    isEqual(parsedDate, appointment.date),
  );

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }
  const newAppointment = {
    id: uuid(),
    provider,
    date: parsedDate,
  };

  appointments.push(newAppointment);
  return response.json(newAppointment);
});

export default appointmentsRouter;