import { Socket } from 'socket.io';
import FeedbackSocketHandler from '../controllers/feedback';


export default class FeedbackEventHandler {
    private socket: Socket;
    private feedbackSocketHandler: FeedbackSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.feedbackSocketHandler = new FeedbackSocketHandler();
    }

    listen() {
        this.socket.on('createFeedback', async (data) => {
            await this.feedbackSocketHandler.createFeedback(this.socket, data);
        });
        this.socket.on('getFeedbacks', async () => {
            await this.feedbackSocketHandler.getFeedbacks(this.socket);
        });
        this.socket.on('getFeedbackById', async (data) => {
            await this.feedbackSocketHandler.getFeedbackById(this.socket, data);
        });
        this.socket.on('updateFeedback', async (data) => {
            await this.feedbackSocketHandler.updateFeedback(this.socket, data);
        });
        this.socket.on('deleteFeedback', async (data) => {
            await this.feedbackSocketHandler.deleteFeedback(this.socket, data);
        });
    }
}
