import { Socket } from 'socket.io';
import DiscardFeedbackController from '../controllers/discardFeedback';

export default class DiscardFeedbackEventHandler {
    private socket: Socket;
    private discardFeedbackController: DiscardFeedbackController;

    constructor(socket: Socket) {
        this.socket = socket;
        this.discardFeedbackController = new DiscardFeedbackController();
    }

    listen() {
        this.socket.on('createDiscardFeedback', async (data) => {
            await this.discardFeedbackController.createDiscardFeedback(this.socket, data);
        });
        this.socket.on('getDiscardFeedbacks', async () => {
            await this.discardFeedbackController.getDiscardFeedbacks(this.socket);
        });
        this.socket.on('getMonthlyDiscardFeedbacks', async () => {
            await this.discardFeedbackController.getMonthlyDiscardFeedbacks(this.socket);
        });
        this.socket.on('getDiscardFeedbackById', async (data) => {
            await this.discardFeedbackController.getDiscardFeedbackById(this.socket, data);
        });
        this.socket.on('getDiscardFeedbacksByCondition', async (data) => {
            await this.discardFeedbackController.getDiscardFeedbacksByCondition(this.socket, data);
        });
        this.socket.on('updateDiscardFeedback', async (data) => {
            await this.discardFeedbackController.updateDiscardFeedback(this.socket, data);
        });
        this.socket.on('deleteDiscardFeedback', async (data) => {
            await this.discardFeedbackController.deleteDiscardFeedback(this.socket, data);
        });
    }
}
