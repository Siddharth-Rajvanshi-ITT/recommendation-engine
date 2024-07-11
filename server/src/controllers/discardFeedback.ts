import { Socket } from 'socket.io';
import DiscardFeedbackService from '../services/discardFeedback';


class DiscardFeedbackController {
    private discardFeedbackService: DiscardFeedbackService;

    public createDiscardFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id: user_id } = data.user;
        const { item_id, question1, question2, question3 } = data;
        const date = new Date().toISOString().split('T')[0];

        try {
            const feedback = await this.discardFeedbackService.createDiscardFeedback(user_id, item_id, date, question1, question2, question3);

            socket.emit('createDiscardFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('createDiscardFeedbackError', { message: error.message });
        }
    };

    public deleteDiscardFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.discardFeedbackService.deleteDiscardFeedback(id);
            socket.emit('deleteDiscardFeedbackSuccess');
        } catch (error) {
            socket.emit('deleteDiscardFeedbackError', { error: error.message });
        }
    };

    public getDiscardFeedbackById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const feedback = await this.discardFeedbackService.getDiscardFeedbackById(id);
            socket.emit('getDiscardFeedbackByIdSuccess', feedback);
        } catch (error) {
            socket.emit('getDiscardFeedbackByIdError', { error: error.message });
        }
    };

    public getDiscardFeedbacks = async (socket: Socket): Promise<void> => {
        try {
            const feedbacks = await this.discardFeedbackService.getDiscardFeedbacks();
            socket.emit('getDiscardFeedbacksSuccess', feedbacks);
        } catch (error) {
            socket.emit('getDiscardFeedbacksError', { error: error.message });
        }
    };

    public getDiscardFeedbacksByCondition = async (socket: Socket, data: any): Promise<void> => {
        const { item_id } = data;
        const { id: user_id } = data.user;
        const date = new Date().toISOString().split('T')[0];
        try {
            const isAlreadyProvidedFeedback = await this.discardFeedbackService.getDiscardFeedbacksByCondition(user_id, item_id, date);
            socket.emit('getDiscardFeedbacksByConditionSuccess', isAlreadyProvidedFeedback);
        } catch (error) {
            socket.emit('getDiscardFeedbacksByConditionError', { message: error.message });
        }
    };

    public updateDiscardFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id, question1, question2, question3 } = data;
        try {
            const feedback = await this.discardFeedbackService.updateDiscardFeedback(id, question1, question2, question3);
            socket.emit('updateDiscardFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('updateDiscardFeedbackError', { error: error.message });
        }
    };

    constructor() {
        this.discardFeedbackService = new DiscardFeedbackService();
    }
}

export default DiscardFeedbackController;
