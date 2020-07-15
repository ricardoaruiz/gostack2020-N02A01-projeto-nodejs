import { EntityRepository, Repository } from 'typeorm';

import User from '../infra/typeorm/entities/User';

@EntityRepository(User)
export default class UsersRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.findOne({ where: { email } });
    return foundUser || null;
  }
}
