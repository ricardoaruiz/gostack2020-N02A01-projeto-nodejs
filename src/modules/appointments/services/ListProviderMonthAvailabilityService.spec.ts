import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository,
    );
  });
  it('should be able to list provider month availability', async () => {
    await fakeAppointmentRepository.create({
      date: new Date(2020, 3, 15, 8, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 8, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 9, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 11, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 12, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 13, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 14, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 15, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 16, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 17, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 21, 10, 0, 0),
      providerId: 'user',
      customerId: 'customer',
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
