import IUserRepository from '@modules/users/repositories/IUserRespository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';

interface IResetPasswordRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    token,
    password,
  }: IResetPasswordRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token is invalid');
    }

    const diff = differenceInMinutes(userToken.createdAt.getTime(), Date.now());

    if (diff >= 120) {
      throw new AppError('Token expired');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    user.password = await this.hashProvider.generateHash(password);
    await this.userRepository.save(user);
  }
}
