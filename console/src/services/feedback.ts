import { Socket } from "socket.io-client";
import { Feedback } from '../types/feedback.js';

class FeedbackService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createFeedback(item_id: number, user_id: number, rating: number, comment: string, feedback_date: Date): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createFeedback', { item_id, user_id, rating, comment, feedback_date });

            this.socket.on('createFeedbackSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('createFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to create feedback'));
            });
        });
    }

    public async getFeedbacks(): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getFeedbacks');

            this.socket.on('getFeedbacksSuccess', (data: Feedback[]) => {
                resolve(data);
            });

            this.socket.on('getFeedbacksError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch feedbacks'));
            });
        });
    }

    public async getFeedbackById(feedback_id: number): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getFeedbackById', { feedback_id });

            this.socket.on('getFeedbackByIdSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('getFeedbackByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch feedback'));
            });
        });
    }

    public async updateFeedback(feedback_id: number, item_id: number, user_id: number, rating: number, comment: string, feedback_date: Date): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateFeedback', { feedback_id, item_id, user_id, rating, comment, feedback_date });

            this.socket.on('updateFeedbackSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('updateFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to update feedback'));
            });
        });
    }

    public async deleteFeedback(feedback_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteFeedback', { feedback_id });

            this.socket.on('deleteFeedbackSuccess', () => {
                resolve();
            });

            this.socket.on('deleteFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete feedback'));
            });
        });
    }
}

export default FeedbackService;
