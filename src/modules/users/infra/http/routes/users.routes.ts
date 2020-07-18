import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { Router } from 'express';
import multer from 'multer';

// Multer para fazer o controle do upload de imagens
const userRoutes = Router();
const upload = multer(uploadConfig);

userRoutes.get('/', async (request, response) => {
  const userRepository: IUserRepository = new UsersRepository();
  const users = await (await userRepository.find()).map(user => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = user;
    return newUser;
  });
  response.json(users);
});

userRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const userRepository: IUserRepository = new UsersRepository();
  const createUserService = new CreateUserService(userRepository);
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
    const userRepository: IUserRepository = new UsersRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(userRepository);
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
