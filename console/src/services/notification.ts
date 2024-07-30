import { Socket } from "socket.io-client";
import { Notification } from '../types/notification.js';

class NotificationService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createNotification(notification: Notification): Promise<Notification> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createNotification', notification);

            this.socket.on('createNotificationSuccess', (data: Notification) => {
                resolve(data);
            });

            this.socket.on('createNotificationError', (error: any) => {
                reject(new Error(error.message || 'Failed to create notification'));
            });
        });
    }

    public async deleteNotification(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteNotification', { id });

            this.socket.on('deleteNotificationSuccess', () => {
                resolve();
            });

            this.socket.on('deleteNotificationError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete notification'));
            });
        });
    }

    public async getNotificationById(id: number): Promise<Notification> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getNotificationById', { id });

            this.socket.on('getNotificationByIdSuccess', (data: Notification) => {
                resolve(data);
            });

            this.socket.on('getNotificationByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch notification'));
            });
        });
    }

    public async getNotifications(): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getNotifications');

            this.socket.on('getNotificationsSuccess', (data: Notification[]) => {
                resolve(data);
            });

            this.socket.on('getNotificationsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch notifications'));
            });
        });
    }

    public async getNotificationsByDate(user: any): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getNotificationByDate', { user });

            this.socket.on('getNotificationByDateSuccess', (data: Notification[]) => {
                resolve(data);
            });

            this.socket.on('getNotificationByDateError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch notification'));
            });
        });
    }

    public async updateNotification(id: number, notification: Notification): Promise<Notification> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateNotification', { id, notification });

            this.socket.on('updateNotificationSuccess', (data: Notification) => {
                resolve(data);
            });

            this.socket.on('updateNotificationError', (error: any) => {
                reject(new Error(error.message || 'Failed to update notification'));
            });
        });
    }
}

export default NotificationService;
