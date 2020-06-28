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

    // TODO gerar o JWT
    return { user };
  }
}
