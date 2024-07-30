import { Socket } from 'socket.io';
import DailyUserFeedbackSocketHandler from '../controllers/dailyUserFeedback';


export default class DailyUserFeedbackEventHandler {
    private socket: Socket;
    private dailyUserFeedbackSocketHandler: DailyUserFeedbackSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.dailyUserFeedbackSocketHandler = new DailyUserFeedbackSocketHandler();
    }

    listen() {
        this.socket.on('createUserFeedback', async (data) => {
            await this.dailyUserFeedbackSocketHandler.createUserFeedback(this.socket, data);
        });
        this.socket.on('getUserFeedbacks', async () => {
            await this.dailyUserFeedbackSocketHandler.getUserFeedbacks(this.socket);
        });
        this.socket.on('getUserFeedbackById', async (data) => {
            await this.dailyUserFeedbackSocketHandler.getUserFeedbackById(this.socket, data);
        });
        this.socket.on('getUserFeedbacksByCondition', async (data) => {
            await this.dailyUserFeedbackSocketHandler.getUserFeedbacksByCondition(this.socket, data);
        });
        this.socket.on('updateUserFeedback', async (data) => {
            await this.dailyUserFeedbackSocketHandler.updateUserFeedback(this.socket, data);
        });
        this.socket.on('deleteUserFeedback', async (data) => {
            await this.dailyUserFeedbackSocketHandler.deleteUserFeedback(this.socket, data);
        });
    }
}
