import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import UsersController from '../controllers/UsersController';

// Multer para fazer o controle do upload de imagens
const userRoutes = Router();
const usersController = new UsersController();
const upload = multer(uploadConfig.multer);

userRoutes.get('/', usersController.list);
userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

/**
 * Rota para receber o avatar do usuário via upload utilizando o multer
 * como middleware
 * PATCH => /users/avatar => multipart-form com o campo avatar
 */
userRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersController.changeAvatar,
);

export default userRoutes;
