import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

const sessionRoutes = Router();
const sessionsController = new SessionsController();

sessionRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionRoutes;
