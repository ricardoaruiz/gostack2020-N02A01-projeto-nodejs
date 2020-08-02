import FakeUserRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let userRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(userRepository);
  });
  it('should be able to show logged user profile', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const userProfile = await showProfileService.execute(user.id);

    expect(userProfile).toBeDefined();
    expect(userProfile?.name).toBe('John Doe');
    expect(userProfile?.email).toBe('johndoe@email.com');
  });

  it('should not be able to show profile to a non existing user', async () => {
    await expect(
      showProfileService.execute('non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
