import { hash } from 'bcryptjs';

import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRespository';

interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  constructor(private userRepository: IUserRepository) { }

  public async execute(data: ICreateUserRequest): Promise<User> {
    const { name, email, password } = data;

    const existUser = await this.userRepository.findByEmail(email);
    if (existUser) {
      throw new AppError('Email already used');
    }

    // TODO criptografar a senha
    const hashedPassoword = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassoword,
    });

    return user;
  }
}
