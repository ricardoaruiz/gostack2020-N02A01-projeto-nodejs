import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRespository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
}
@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute(data: ICreateUserRequest): Promise<User> {
    const { name, email, password } = data;

    const existUser = await this.userRepository.findByEmail(email);
    if (existUser) {
      throw new AppError('Email already used');
    }

    // TODO criptografar a senha
    const hashedPassoword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassoword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}
