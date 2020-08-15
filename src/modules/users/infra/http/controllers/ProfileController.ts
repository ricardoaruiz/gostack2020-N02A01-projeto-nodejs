import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpateProfileService from '@modules/users/services/UpdateProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

interface IUpdateProfileRequest {
  name: string;
  email: string;
  password: string;
  old_password: string;
}

export default class UpdateProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute(userId);

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const profileData = request.body as IUpdateProfileRequest;

    const updateProfileService = container.resolve(UpateProfileService);

    await updateProfileService.execute({
      id: userId,
      name: profileData.name,
      email: profileData.email,
      password: profileData.password,
      oldPassword: profileData.old_password,
    });

    return response.status(204).send();
  }
}
