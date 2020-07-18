import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../../../config/upload';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRespository';

interface IUpdateUserAvatarRequest {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  constructor(private userRepository: IUserRepository) { }

  public async execute({
    user_id,
    avatarFilename,
  }: IUpdateUserAvatarRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated user change avatar', 401);
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
    await this.userRepository.save(user);

    return user;
  }
}
