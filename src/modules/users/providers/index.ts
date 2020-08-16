import { container } from 'tsyringe';

// User Repository
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRspository from '@modules/users/repositories/IUserRespository';

// UserToken Repository
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UsersTokenRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

// HashProvider
import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IUserRspository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
