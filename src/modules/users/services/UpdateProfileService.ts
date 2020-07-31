import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import User from '../infra/typeorm/entities/User';

interface IUpdateProfileData {
  id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute(data: IUpdateProfileData): Promise<User> {
    const { id, email, oldPassword, password } = data;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not exist');
    }

    const isValidOldPassword = await this.hashProvider.compareHash(
      oldPassword || '',
      user.password,
    );

    if (password && !isValidOldPassword) {
      throw new AppError('Invalid password');
    }

    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id !== id) {
      throw new AppError('Email already taken');
    }

    Object.assign(user, data);

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.userRepository.save(user);

    return user;
  }
}
