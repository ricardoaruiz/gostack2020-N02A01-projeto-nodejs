import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

// import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentRepository';
// const appointmentRepository1: IAppointmentsRepository = {
//   create: jest.fn(),
//   find: jest.fn(),
//   findByDate: jest.fn(),
// };

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );

    // appointmentRepository1.create = jest.fn().mockReturnValue({
    //   id: 'abcd',
    //   providerId: '123456',
    // });

    const appointment = await createAppointmentService.execute({
      provider: '123456',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );

    appointmentRepository.findByDate = jest.fn().mockReturnValue({});

    expect(
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
