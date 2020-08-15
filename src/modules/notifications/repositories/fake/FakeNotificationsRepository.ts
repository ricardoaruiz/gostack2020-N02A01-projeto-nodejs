import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create(
    notification: ICreateNotificationDTO,
  ): Promise<Notification> {
    const { recipient_id, content } = notification;

    const createdNotification = new Notification();
    this.notifications.push(createdNotification);
    Object.assign(createdNotification, {
      id: new ObjectID(),
      recipient_id,
      content,
    });
    return createdNotification;
  }
}
