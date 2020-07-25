import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fake/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let userRepository: FakeUserRepository;
let userTokensRepository: FakeUserTokensRepository;
let mailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    userTokensRepository = new FakeUserTokensRepository();
    mailProvider = new FakeMailProvider();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      userRepository,
      userTokensRepository,
      mailProvider,
    );
  });

  it('should be able recover the password using the email', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@email.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non existing user', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const tokenGenerate = jest.spyOn(userTokensRepository, 'create');

    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@email.com',
    });

    expect(tokenGenerate).toHaveBeenCalledWith(user.id);
  });
});
