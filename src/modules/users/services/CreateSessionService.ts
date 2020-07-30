import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRespository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface ICreateSessionRequest {
  email: string;
  password: string;
}

interface ICreateSessionResponse {
  user: User;
  token: string;
}

@injectable()
export default class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute(
    data: ICreateSessionRequest,
  ): Promise<ICreateSessionResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid user or password', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      data.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new AppError('Invalid user or password', 401);
    }

    // Geração do JWT com o id do usuário no subject
    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}
