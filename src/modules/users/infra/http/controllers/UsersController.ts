import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRespository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const userRepository: IUserRepository = new UsersRepository();
    const users = await (await userRepository.find()).map((user: User) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...newUser } = user;
      return newUser;
    });
    return response.json(users);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = container.resolve(CreateUserService);
    const createdUser = await createUserService.execute({
      name,
      email,
      password,
    });

    delete createdUser.password;

    return response.status(201).json(createdUser);
  }

  public async changeAvatar(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);
    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return response.status(200).json(userWithoutPassword);
  }
}
