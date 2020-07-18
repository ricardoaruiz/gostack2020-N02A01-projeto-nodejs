import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import multer from 'multer';

import UsersController from '../controllers/UsersController';

// Multer para fazer o controle do upload de imagens
const userRoutes = Router();
const usersController = new UsersController();
const upload = multer(uploadConfig);

userRoutes.get('/', usersController.list);
userRoutes.post('/', usersController.create);

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
