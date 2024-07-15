import { Socket } from 'socket.io';
import DailyMenuItemSocketHandler from '../controllers/dailyMenuItems';

export default class DailyMenuItemEventHandler {
    private socket: Socket;
    private dailyMenuItemSocketHandler: DailyMenuItemSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.dailyMenuItemSocketHandler = new DailyMenuItemSocketHandler();
    }

    listen() {
        this.socket.on('createDailyMenuItem', async (data) => {
            await this.dailyMenuItemSocketHandler.createDailyMenuItem(this.socket, data);
        });
        this.socket.on('getDailyMenuItems', async () => {
            await this.dailyMenuItemSocketHandler.getDailyMenuItems(this.socket);
        });
        this.socket.on('getDailyMenuItemById', async (data) => {
            await this.dailyMenuItemSocketHandler.getDailyMenuItemById(this.socket, data);
        });
        this.socket.on('getDailyMenuItemByDate', async (data) => {
            await this.dailyMenuItemSocketHandler.getDailyMenuItemByDate(this.socket, data);
        });
        this.socket.on('updateDailyMenuItem', async (data) => {
            await this.dailyMenuItemSocketHandler.updateDailyMenuItem(this.socket, data);
        });
        this.socket.on('deleteDailyMenuItem', async (data) => {
            await this.dailyMenuItemSocketHandler.deleteDailyMenuItem(this.socket, data);
        });
    }
}
