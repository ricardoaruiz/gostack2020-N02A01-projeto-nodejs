import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const createSessionService = new CreateSessionService();
    const { user } = await createSessionService.execute({ email, password });

    response.json({ user });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

export default sessionRoutes;
