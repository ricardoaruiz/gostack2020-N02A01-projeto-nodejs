import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProviders from '../dtos/IFindAllProviders';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  create(user: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  find(): Promise<User[]>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  findAllProviders(data: IFindAllProviders): Promise<User[]>;
}
