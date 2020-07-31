import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let createSessionService: CreateSessionService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createSessionService = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should able to create new session', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const response = await createSessionService.execute({
      email: 'johndoe@mail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toBe(user);
  });

  it('should not be able to create new session with wrong password', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await expect(
      createSessionService.execute({
        email: 'johndoe@mail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create new session with non existing user', async () => {
    await expect(
      createSessionService.execute({
        email: 'johndoe@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
