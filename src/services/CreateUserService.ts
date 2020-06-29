import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import UsersRepository from '../repositories/UsersRepository';
import User from '../models/User';

import AppError from '../errors/AppError';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute(data: CreateUserRequest): Promise<User> {
    const { name, email, password } = data;
    const usersRepository = getCustomRepository(UsersRepository);

    const existUser = await usersRepository.findByEmail(email);
    if (existUser) {
      throw new AppError('Email already used');
    }

    // TODO criptografar a senha
    const hashedPassoword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassoword,
    });

    const createdUser = await usersRepository.save(user);

    return createdUser;
  }
}
