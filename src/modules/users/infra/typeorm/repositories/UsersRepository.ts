import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProviders from '@modules/users/dtos/IFindAllProviders';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import { getRepository, Not, Repository } from 'typeorm';

import User from '../entities/User';

export default class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(user: ICreateUserDTO): Promise<User> {
    const newUser = this.ormRepository.create(user);
    await this.ormRepository.save(newUser);
    return newUser;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async find(): Promise<User[]> {
    const users = this.ormRepository.find();
    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({ where: { email } });
    return foundUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({
      where: { id },
    });
    return foundUser;
  }

  public async findAllProviders(data: IFindAllProviders): Promise<User[]> {
    if (data.except_user_id) {
      return this.ormRepository.find({
        where: { id: Not(data.except_user_id) },
      });
    }
    return this.ormRepository.find();
  }
}
