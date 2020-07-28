import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fake/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';
import { addMinutes } from 'date-fns';

describe('ResetPasswordService', () => {
  let userRepository: FakeUserRepository;
  let userTokenRepository: FakeUserTokensRepository;
  let hashProvider: FakeHashProvider;
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    userTokenRepository = new FakeUserTokensRepository();
    hashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      userRepository,
      userTokenRepository,
      hashProvider,
    );
  });
  it('should be able to reset the password', async () => {
    const generateHash = jest.spyOn(hashProvider, 'generateHash');

    const { id } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const { token } = await userTokenRepository.create(id);

    await resetPasswordService.execute({ token, password: '654321' });

    const user = await userRepository.findById(id);

    expect(generateHash).toHaveBeenCalledWith('654321');
    expect(user?.password).toEqual('654321');
  });

  it('should not be able to reset the password with a invalid token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'invalidtoken',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with a non existing user', async () => {
    const { token } = await userTokenRepository.create('non-existing-user');

    await expect(
      resetPasswordService.execute({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password when token limit expires', async () => {
    const { id: user_id } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    userTokenRepository.findByToken = jest.fn().mockReturnValue({
      id: '6d366bd9-d912-4015-8900-4d51af51b796',
      token: '14b869a1-d01b-4dbe-bbae-de97849a9ac8',
      user_id,
      createdAt: addMinutes(Date.now(), 120.1),
      updatedAt: addMinutes(Date.now(), 120.1),
    });

    await expect(
      resetPasswordService.execute({
        token: '14b869a1-d01b-4dbe-bbae-de97849a9ac8',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
