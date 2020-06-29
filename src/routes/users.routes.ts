import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

// Multer para fazer o controle do upload de imagens
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import UsersRepository from '../repositories/UsersRepository';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const upload = multer(uploadConfig);

userRoutes.get('/', async (request, response) => {
  const usersRepository = getCustomRepository(UsersRepository);
  const users = await (await usersRepository.find()).map(user => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = user;
    return newUser;
  });
  response.json(users);
});

userRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService();
  const createdUser = await createUserService.execute({
    name,
    email,
    password,
  });

  delete createdUser.password;

  return response.status(201).json(createdUser);
});

/**
 * Rota para receber o avatar do usuário via upload utilizando o multer
 * como middleware
 * PATCH => /users/avatar => multipart-form com o campo avatar
 */
userRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();
    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return response.status(200).json(userWithoutPassword);
  },
);

export default userRoutes;
