import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

export default class UsersTokenRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async create(userId: string): Promise<UserToken> {
    const newUserToken = this.ormRepository.create({
      user_id: userId,
    });
    await this.ormRepository.save(newUserToken);
    return newUserToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const foundUserToken = await this.ormRepository.findOne({
      where: { token },
    });
    return foundUserToken;
  }
}
