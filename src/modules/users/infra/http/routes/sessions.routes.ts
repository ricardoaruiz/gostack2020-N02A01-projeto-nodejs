import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import { Router } from 'express';

const sessionRoutes = Router();
const sessionsController = new SessionsController();

sessionRoutes.post('/', sessionsController.create);

export default sessionRoutes;
