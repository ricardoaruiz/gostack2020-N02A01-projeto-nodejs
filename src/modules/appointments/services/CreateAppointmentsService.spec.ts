import FakeAppointmentRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointment = await createAppointmentService.execute({
      provider: '123456',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('123456');
  });

  xit('should not be able to create two appointments on the same time', () => { });
});
