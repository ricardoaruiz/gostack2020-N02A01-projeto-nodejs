import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let userRespository: FakeUserRepository;
let listProviderService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    userRespository = new FakeUserRepository();
    listProviderService = new ListProvidersService(userRespository);
  });

  it('should be able to list all providers except user logged', async () => {
    const loggedUser = await userRespository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });
    await userRespository.create({
      name: 'John Tre',
      email: 'johnTre@mail.com',
      password: '654321',
    });
    await userRespository.create({
      name: 'John Four',
      email: 'johnFour@mail.com',
      password: '987654',
    });

    const providers = await listProviderService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toBeDefined();
    expect(providers.length).toBe(2);
    expect(providers[0].id).not.toEqual(loggedUser.id);
    expect(providers[1].id).not.toEqual(loggedUser.id);
  });
});
