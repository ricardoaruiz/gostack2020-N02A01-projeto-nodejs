// Aqui é realizado o registro do que será gerenciado pelo tsyringe para realizar
// a injeção dessas dependências.
// Esse arquivo é importado no server.ts
import './providers';
import '@modules/users/providers';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRspository from '@modules/users/repositories/IUserRespository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UsersTokenRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

import { container } from 'tsyringe';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUserRspository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
