import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import UpdataUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';
import FakeStorageProdiver from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

describe('UpdateUserAvatar', () => {
  it('should not able to change avatar from not exists user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProdiver();
    const updataUserAvatarService = new UpdataUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    fakeUserRepository.findById = jest.fn().mockReturnValue(undefined);

    try {
      await updataUserAvatarService.execute({
        user_id: 'sfsdfdgdfg',
        avatarFilename: 'avatar.jpeg',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Only authenticated user change avatar');
    }
  });

  it('should able to change avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProdiver();
    const updataUserAvatarService = new UpdataUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    fakeUserRepository.findById = jest.fn().mockReturnValue({
      id: 'sfsdfdgdfg',
      name: 'John Doe',
      email: 'jphndoe@mail.com',
      password: '123456',
      avatar: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await updataUserAvatarService.execute({
      user_id: 'sfsdfdgdfg',
      avatarFilename: 'avatar.jpeg',
    });

    expect(user.avatar).toBe('avatar.jpeg');
  });

  it('should able to change avatar with user that has an avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProdiver();
    const updataUserAvatarService = new UpdataUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    fakeUserRepository.findById = jest.fn().mockReturnValue({
      id: 'sfsdfdgdfg',
      name: 'John Doe',
      email: 'jphndoe@mail.com',
      password: '123456',
      avatar: 'avatar.jpeg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await updataUserAvatarService.execute({
      user_id: 'sfsdfdgdfg',
      avatarFilename: 'avatar1.jpeg',
    });

    expect(user.avatar).toBe('avatar1.jpeg');
  });
});
