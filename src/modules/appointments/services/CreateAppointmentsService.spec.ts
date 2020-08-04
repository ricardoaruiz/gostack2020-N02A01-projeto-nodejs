import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FnsDateProvider from '@shared/container/providers/DateProvider/implementations/FnsDateProvider';
import AppError from '@shared/errors/AppError';

let dateProvider: FnsDateProvider;
let appointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    dateProvider = new FnsDateProvider();
    appointmentRepository = new FakeAppointmentRepository(dateProvider);
    createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      provider: '123456',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    appointmentRepository.findByDate = jest.fn().mockReturnValue({});

    await expect(
      createAppointmentService.execute({
        provider: '123456',
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createAppointmentService.execute({
        provider: '123456',
        date: new Date(),
      });
    } catch (error) {
      expect(error.message).toEqual('This appointment is already booked');
    }
  });
});
