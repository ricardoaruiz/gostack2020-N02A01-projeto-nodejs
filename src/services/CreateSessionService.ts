import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
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

    const token = sign({}, '3819dea8f1f71e34b8716ae533c81b6c', {
      subject: user.id,
      expiresIn: '1d',
    });

    // TODO gerar o JWT
    return { user, token };
  }
}
