import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });
  it('should be able to list provider day availability at begin of period', async () => {
    Date.now = jest.fn().mockReturnValueOnce(new Date(2020, 4, 20, 8, 0, 0));

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 8, 0, 0),
      providerId: 'user',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10, 0, 0),
      providerId: 'user',
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: true },
        { hour: 15, available: true },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });

  it('should be able to list provider day availability at middle of period', async () => {
    // Date.now = jest.fn().mockReturnValueOnce(new Date(2020, 4, 20, 12, 0, 0));
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 20, 12, 0, 0).getTime());

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 14, 0, 0),
      providerId: 'user',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 15, 0, 0),
      providerId: 'user',
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
