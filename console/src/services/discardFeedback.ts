import { Socket } from "socket.io-client";

class DiscardFeedbackService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createDiscardFeedback(item_id: number, user_id: number, answer1: string, answer2: string, answer3: string){
        return new Promise((resolve, reject) => {
            this.socket.emit('createDiscardFeedback', { item_id, user_id, answer1, answer2, answer3 });

            this.socket.on('createDiscardFeedbackSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('createDiscardFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to create discard feedback'));
            });
        });
    }

    public async getDiscardFeedbacks() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDiscardFeedbacks');

            this.socket.on('getDiscardFeedbacksSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getDiscardFeedbacksError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard feedbacks'));
            });
        });
    }

    public async getMonthlyDiscardFeedbacks() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getMonthlyDiscardFeedbacks');

            this.socket.on('getMonthlyDiscardFeedbacksSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getMonthlyDiscardFeedbacksError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard feedbacks'));
            });
        });
    }

    public async getDiscardFeedbackById(id: number){
        return new Promise((resolve, reject) => {
            this.socket.emit('getDiscardFeedbackById', { id });

            this.socket.on('getDiscardFeedbackByIdSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getDiscardFeedbackByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard feedback by id'));
            });
        });
    }

    public async getDiscardFeedbacksByCondition(item_id: number, user_id: number) {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDiscardFeedbacksByCondition', { item_id, user_id });

            this.socket.on('getDiscardFeedbacksByConditionSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getDiscardFeedbacksByConditionError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard feedbacks by condition'));
            });
        });
    }

    public async updateDiscardFeedback(id: number, item_id: number, user_id: number, date: string, answer1: string, answer2: string, answer3: string) {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateDiscardFeedback', { id, item_id, user_id, date, answer1, answer2, answer3 });

            this.socket.on('updateDiscardFeedbackSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('updateDiscardFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to update discard feedback'));
            });
        });
    }

    public async deleteDiscardFeedback(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteDiscardFeedback', { id });

            this.socket.on('deleteDiscardFeedbackSuccess', () => {
                resolve();
            });

            this.socket.on('deleteDiscardFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete discard feedback'));
            });
        });
    }
}

export default DiscardFeedbackService;
