import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentRepository,
    );
  });
  it('should be able to list provider appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 8, 0, 0),
      providerId: 'provider',
      customerId: 'customer',
    });
    const appointment2 = await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10, 0, 0),
      providerId: 'provider',
      customerId: 'customer',
    });

    const availability = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual([appointment1, appointment2]);
  });
});
