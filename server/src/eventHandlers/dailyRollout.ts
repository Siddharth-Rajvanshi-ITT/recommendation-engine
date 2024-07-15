import { Socket } from 'socket.io';
import DailyRolloutSocketHandler from '../controllers/dailyRollout';

export default class DailyRolloutEventHandler {
    private socket: Socket;
    private dailyRolloutSocketHandler: DailyRolloutSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.dailyRolloutSocketHandler = new DailyRolloutSocketHandler();
    }

    listen() {
        this.socket.on('createDailyRollout', async (data) => {
            await this.dailyRolloutSocketHandler.createDailyRollout(this.socket, data);
        });
        this.socket.on('getDailyRollouts', async () => {
            await this.dailyRolloutSocketHandler.getDailyRollouts(this.socket);
        });
        this.socket.on('getDailyRolloutById', async (data) => {
            await this.dailyRolloutSocketHandler.getDailyRolloutById(this.socket, data);
        });
        this.socket.on('getDailyRolloutByDate', async (data) => {
            await this.dailyRolloutSocketHandler.getDailyRolloutByDate(this.socket, data);
        });
        this.socket.on('updateDailyRollout', async (data) => {
            await this.dailyRolloutSocketHandler.updateDailyRollout(this.socket, data);
        });
        this.socket.on('deleteDailyRollout', async (data) => {
            await this.dailyRolloutSocketHandler.deleteDailyRollout(this.socket, data);
        });
    }
}
