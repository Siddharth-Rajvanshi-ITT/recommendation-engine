import { Socket } from 'socket.io';
import DailyItemSubmissionController from '../controllers/dailyItemSubmission';

export default class DailyItemSubmissionEventHandler {
    private socket: Socket;
    private dailyItemSubmissionController: DailyItemSubmissionController;

    constructor(socket: Socket) {
        this.socket = socket;
        this.dailyItemSubmissionController = new DailyItemSubmissionController();
    }

    listen() {
        this.socket.on('createDailyItemSubmission', async (data) => {
            await this.dailyItemSubmissionController.createDailyItemSubmission(this.socket, data);
        });
        this.socket.on('getDailyItemSubmissions', async () => {
            await this.dailyItemSubmissionController.getDailyItemSubmissions(this.socket);
        });
        this.socket.on('getDailyItemSubmissionById', async (data) => {
            await this.dailyItemSubmissionController.getDailyItemSubmissionById(this.socket, data);
        });
        this.socket.on('getDailyItemSubmissionByDate', async (data) => {
            await this.dailyItemSubmissionController.getDailyItemSubmissionByDate(this.socket, data);
        });
        this.socket.on('updateDailyItemSubmission', async (data) => {
            await this.dailyItemSubmissionController.updateDailyItemSubmission(this.socket, data);
        });
        this.socket.on('deleteDailyItemSubmission', async (data) => {
            await this.dailyItemSubmissionController.deleteDailyItemSubmission(this.socket, data);
        });
    }
}
