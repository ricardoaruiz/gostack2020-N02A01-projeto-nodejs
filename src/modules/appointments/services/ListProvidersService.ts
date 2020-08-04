import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IListUsersRequest {
  user_id?: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) { }

  public async execute({ user_id }: IListUsersRequest): Promise<User[]> {
    const providers = await this.userRepository.findAllProviders({
      except_user_id: user_id,
    });
    return providers;
  }
}
