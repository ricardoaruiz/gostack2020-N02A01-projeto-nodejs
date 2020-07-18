import CreateSessionService from '@modules/users/services/CreateSessionService';
import { Router } from 'express';
import { container } from 'tsyringe';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSessionService = container.resolve(CreateSessionService);
  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: removedPassword, ...userWithoutPassword } = user;
  response.json({ user: userWithoutPassword, token });
});

export default sessionRoutes;
