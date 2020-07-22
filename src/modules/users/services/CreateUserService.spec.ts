import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should able to create new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not able to create new user because user already exists', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

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
