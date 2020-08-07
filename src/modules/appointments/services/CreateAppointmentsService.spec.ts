import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let appointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentRepository = new FakeAppointmentRepository();
    createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    const appointment = await createAppointmentService.execute({
      provider: 'provider-id',
      customer: 'customer-id',
      date: new Date(2020, 4, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('provider-id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    appointmentRepository.findByDate = jest.fn().mockReturnValue({});

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointmentService.execute({
        provider: 'provider-id',
        customer: 'customer-id',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createAppointmentService.execute({
        provider: 'provider-id',
        customer: 'customer-id',
        date: new Date(2020, 4, 10, 13),
      });
    } catch (error) {
      expect(error.message).toEqual('This appointment is already booked');
    }
  });

  it('should not be able to create appointment on a past date', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointmentService.execute({
        provider: 'provider-id',
        customer: 'customer-id',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment with same customer as provider', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointmentService.execute({
        provider: 'provider-id',
        customer: 'provider-id',
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment before 8h', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointmentService.execute({
        provider: 'provider-id',
        customer: 'customer-id',
        date: new Date(2020, 4, 11, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment after 17h', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointmentService.execute({
        provider: 'provider-id',
        customer: 'customer-id',
        date: new Date(2020, 4, 11, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
