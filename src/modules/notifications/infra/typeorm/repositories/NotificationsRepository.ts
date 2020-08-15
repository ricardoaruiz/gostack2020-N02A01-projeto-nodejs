import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create(
    notification: ICreateNotificationDTO,
  ): Promise<Notification> {
    const { recipient_id, content } = notification;
    const createdNotification = this.ormRepository.create({
      recipient_id,
      content,
    });

    await this.ormRepository.save(createdNotification);

    return createdNotification;
  }
}
