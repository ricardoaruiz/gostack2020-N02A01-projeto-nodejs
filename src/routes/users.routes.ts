import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CreateUserService from '../services/CreateUserService';
import UsersRepository from '../repositories/UsersRepository';

const userRoutes = Router();

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
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();
    const createdUser = await createUserService.execute({
      name,
      email,
      password,
    });

    delete createdUser.password;

    return response.status(201).json(createdUser);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

export default userRoutes;
