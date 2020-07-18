import CreateSessionService from '@modules/users/services/CreateSessionService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSessionService = container.resolve(CreateSessionService);
    const { user, token } = await createSessionService.execute({
      email,
      password,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: removedPassword, ...userWithoutPassword } = user;
    return response.json({ user: userWithoutPassword, token });
  }
}
