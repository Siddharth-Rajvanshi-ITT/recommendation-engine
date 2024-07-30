import { Socket } from 'socket.io';
import NotificationSocketHandler from '../controllers/notifications';

export default class NotificationEventHandler {
    private socket: Socket;
    private notificationSocketHandler: NotificationSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.notificationSocketHandler = new NotificationSocketHandler();
    }

    listen() {
        this.socket.on('createNotification', async (data) => {
            console.log('Data: ', data);
            await this.notificationSocketHandler.createNotification(this.socket, data);
        });
        this.socket.on('getNotifications', async () => {
            await this.notificationSocketHandler.getNotifications(this.socket);
        });
        this.socket.on('getNotificationById', async (data) => {
            await this.notificationSocketHandler.getNotificationById(this.socket, data);
        });
        this.socket.on('getNotificationByDate', async (data) => {
            await this.notificationSocketHandler.getNotificationByDate(this.socket, data);
        });
        this.socket.on('updateNotification', async (data) => {
            await this.notificationSocketHandler.updateNotification(this.socket, data);
        });
        this.socket.on('deleteNotification', async (data) => {
            await this.notificationSocketHandler.deleteNotification(this.socket, data);
        });
    }
}
