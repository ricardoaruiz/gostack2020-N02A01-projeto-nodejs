import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';

import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async create(user_id: string): Promise<UserToken> {
    const userToken = {
      id: uuid(),
      token: uuid(),
      user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.userTokens.push(userToken);

    return userToken;
  }
}
