import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let userRepository: FakeUserRepository;
let hashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    hashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      userRepository,
      hashProvider,
    );
  });

  it('should be able to update profile with password', async () => {
    const spyGenerateHash = jest.spyOn(hashProvider, 'generateHash');

    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const user = await updateProfileService.execute({
      id: createdUser.id,
      name: 'John Doe1',
      email: 'johndoe@email1.com',
      oldPassword: '123456',
      password: '123457',
    });

    expect(spyGenerateHash).toHaveBeenCalledWith('123457');
    expect(user.name).toBe('John Doe1');
    expect(user.email).toBe('johndoe@email1.com');
    expect(user.password).toBe('123457');
  });

  it('should be able to update profile without password', async () => {
    const spyGenerateHash = jest.spyOn(hashProvider, 'generateHash');

    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const user = await updateProfileService.execute({
      id: createdUser.id,
      name: 'John Doe1',
      email: 'johndoe@email1.com',
    });

    expect(spyGenerateHash).not.toHaveBeenCalled();
    expect(user.name).toBe('John Doe1');
    expect(user.email).toBe('johndoe@email1.com');
    expect(user.password).toBe('123456');
  });

  it('should not be able to update profile with wrong old password', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        id: createdUser.id,
        name: 'John Doe1',
        email: 'johndoe@email1.com',
        oldPassword: 'wrong-old-password',
        password: '123457',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile with an email already taken by another user', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });
    const otherUser = await userRepository.create({
      name: 'John Tre',
      email: 'johntre@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        id: createdUser.id,
        name: 'John Doe1',
        email: otherUser.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile for not existing user', async () => {
    await expect(
      updateProfileService.execute({
        id: 'non-exist-user-id',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
