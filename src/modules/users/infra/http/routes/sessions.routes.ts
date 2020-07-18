import IUserRepository from '@modules/users/repositories/IUserRespository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import { Router } from 'express';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;

  const usersRepository: IUserRepository = new UsersRepository();
  const createSessionService = new CreateSessionService(usersRepository);
  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: removedPassword, ...userWithoutPassword } = user;
  response.json({ user: userWithoutPassword, token });
});

export default sessionRoutes;
