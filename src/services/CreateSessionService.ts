import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import authConfig from '../config/auth';
import UserRepository from '../repositories/UsersRepository';
import User from '../models/User';

interface CreateSessionRequest {
  email: string;
  password: string;
}

interface CreateSessionResponse {
  user: User;
  token: string;
}

export default class CreateSessionService {
  public async execute(
    data: CreateSessionRequest,
  ): Promise<CreateSessionResponse> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw Error('Invalid user or password');
    }

    const passwordMatched = await compare(data.password, user.password);
    if (!passwordMatched) {
      throw Error('Invalid user or password');
    }

    // Geração do JWT com o id do usuário no subject
    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}
