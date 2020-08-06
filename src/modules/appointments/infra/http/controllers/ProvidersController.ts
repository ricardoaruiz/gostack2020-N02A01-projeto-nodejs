import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const except_user_id = request.user.id;

    const listProvidersService = container.resolve(ListProvidersService);

    const providers = await listProvidersService.execute({
      user_id: except_user_id,
    });

    return response.status(200).json(providers);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id, month, year } = request.query;

    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month,
      year,
    });
    return response.status(200).json(availability);
  }
}
