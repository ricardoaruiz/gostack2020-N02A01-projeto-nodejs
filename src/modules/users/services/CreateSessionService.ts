import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRespository';

interface ICreateSessionRequest {
  email: string;
  password: string;
}

interface ICreateSessionResponse {
  user: User;
  token: string;
}

export default class CreateSessionService {
  constructor(private userRepository: IUserRepository) { }

  public async execute(
    data: ICreateSessionRequest,
  ): Promise<ICreateSessionResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid user or password', 401);
    }

    const passwordMatched = await compare(data.password, user.password);
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
