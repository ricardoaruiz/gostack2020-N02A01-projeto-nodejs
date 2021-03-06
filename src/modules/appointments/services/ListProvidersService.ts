import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';

interface IListUsersRequest {
  user_id?: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ user_id }: IListUsersRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!providers) {
      providers = await this.userRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`providers-list:${user_id}`, providers);
    }

    return providers;
  }
}
