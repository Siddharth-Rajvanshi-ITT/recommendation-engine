import { Socket } from 'socket.io';
import NotificationService from '../services/notifications';

class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    public createNotification = async (socket: Socket, data: any): Promise<void> => {
        const { notification_type, notification_data, notification_timestamp } = data;
        try {
            const notification = await this.notificationService.createNotification(notification_type, notification_data, notification_timestamp);
            socket.emit('createNotificationSuccess', notification);
        } catch (error) {
            socket.emit('createNotificationError', { error: error.message });
        }
    };

    public getNotifications = async (socket: Socket): Promise<void> => {
        try {
            const notifications = await this.notificationService.getNotifications();
            socket.emit('getNotificationsSuccess', notifications);
        } catch (error) {
            socket.emit('getNotificationsError', { error: error.message });
        }
    };

    public getNotificationById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const notification = await this.notificationService.getNotificationById(+id);
            socket.emit('getNotificationByIdSuccess', notification);
        } catch (error) {
            socket.emit('getNotificationByIdError', { error: error.message });
        }
    };

    public getNotificationByDate = async (socket: Socket, data: any): Promise<void> => {
        const { date } = data;
        try {
            const notification = await this.notificationService.getNotificationByDate(date);
            socket.emit('getNotificationByDateSuccess', notification);
        } catch (error) {
            socket.emit('getNotificationByDateError', { error: error.message });
        }
    };

    public updateNotification = async (socket: Socket, data: any): Promise<void> => {
        const { id, user_id, notification_type, notification_data, notification_timestamp } = data;
        try {
            const notification = await this.notificationService.updateNotification(+id, user_id, notification_type, notification_data, notification_timestamp);
            socket.emit('updateNotificationSuccess', notification);
        } catch (error) {
            socket.emit('updateNotificationError', { error: error.message });
        }
    };

    public deleteNotification = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.notificationService.deleteNotification(+id);
            socket.emit('deleteNotificationSuccess');
        } catch (error) {
            socket.emit('deleteNotificationError', { error: error.message });
        }
    };
}

export default NotificationController;
