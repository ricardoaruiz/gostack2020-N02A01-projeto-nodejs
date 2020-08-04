import { Router } from 'express';

import sessions from '@modules/users/infra/http/routes/sessions.routes';
import passwords from '@modules/users/infra/http/routes/password.routes';
import profile from '@modules/users/infra/http/routes/profile.routes';
import users from '@modules/users/infra/http/routes/users.routes';
import appointments from '@modules/appointments/infra/http/routes/appointments.routes';
import providers from '@modules/appointments/infra/http/routes/providers.routes';

const routes = Router();

routes.use('/sessions', sessions);
routes.use('/profile', profile);
routes.use('/users', users);
routes.use('/appointments', appointments);
routes.use('/password', passwords);
routes.use('/providers', providers);

export default routes;
