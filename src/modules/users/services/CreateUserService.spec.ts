import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should able to create new user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not able to create new user because user already exists', async () => {
    fakeUserRepository.findByEmail = jest.fn().mockReturnValue({
      id: 'sfsdfdgdfg',
      name: 'John Doe',
      email: 'jphndoe@mail.com',
      password: '123456',
      avatar: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123456',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Email already used');
    }
  });
});
