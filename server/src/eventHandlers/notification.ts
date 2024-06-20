import { Socket } from "socket.io";
import NotificationSocketHandler from "../socketHandlers/notifications";

const notificationSocketHandler = new NotificationSocketHandler();


export default class NotificationEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createNotification", async (data) => {
            await notificationSocketHandler.createNotification(this.socket, data);
        });
        this.socket.on("getNotifications", async () => {
            await notificationSocketHandler.getNotifications(this.socket);
        });
        this.socket.on("getNotificationById", async (data) => {
            await notificationSocketHandler.getNotificationById(this.socket, data);
        });
        this.socket.on("updateNotification", async (data) => {
            await notificationSocketHandler.updateNotification(this.socket, data);
        });
        this.socket.on("deleteNotification", async (data) => {
            await notificationSocketHandler.deleteNotification(this.socket, data);
        });
    }
}

