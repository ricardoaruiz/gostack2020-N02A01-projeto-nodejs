import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const createSessionService = new CreateSessionService();
    const { user, token } = await createSessionService.execute({
      email,
      password,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: removedPassword, ...userWithotPassword } = user;
    response.json({ user: userWithotPassword, token });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

export default sessionRoutes;
