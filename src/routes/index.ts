// src/routes/index.ts
import { Router } from 'express';

import sessions from './sessions.routes';
import users from './users.routes';
import appointments from './appointments.routes';

const routes = Router();

routes.use('/sessions', sessions);
routes.use('/users', users);
routes.use('/appointments', appointments);

export default routes;
