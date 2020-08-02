import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) { }

  public async execute(userId: string): Promise<User | undefined> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not exists');
    }

    return user;
  }
}
