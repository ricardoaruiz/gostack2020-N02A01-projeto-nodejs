import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UsersRepository';
import uploadConfig from '../config/upload';
import User from '../models/User';

interface UpdateUserAvatarRequest {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatarFilename,
  }: UpdateUserAvatarRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new Error('Only authenticated user change avatar');
    }

    if (user.avatar) {
      const fileToRemoveFromDisk = path.join(
        uploadConfig.directory,
        user.avatar,
      );

      const fileAvatarExists = fs.promises.stat(fileToRemoveFromDisk);
      if (fileAvatarExists) {
        fs.promises.unlink(fileToRemoveFromDisk);
      }
    }

    user.avatar = avatarFilename;
    await userRepository.save(user);

    return user;
  }
}
