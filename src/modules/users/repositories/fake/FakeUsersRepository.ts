import IUserRepository from '@modules/users/repositories/IUserRespository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';

export default class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  async create(user: ICreateUserDTO): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, { id: uuid() }, user);

    this.users.push(newUser);
    return newUser;
  }

  async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === user.id);
    this.users.splice(userIndex, 1, user);
    return user;
  }

  async find(): Promise<User[]> {
    return this.users;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
}
