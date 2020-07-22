// Aqui é realizado o registro do que será gerenciado pelo tsyringe para realizar
// a injeção dessas dependências.
// Esse arquivo é importado no server.ts
import '@modules/users/providers';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRspository from '@modules/users/repositories/IUserRespository';
import { container } from 'tsyringe';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUserRspository>(
  'UsersRepository',
  UsersRepository,
);
