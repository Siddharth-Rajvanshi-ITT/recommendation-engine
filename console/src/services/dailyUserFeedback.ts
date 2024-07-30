import { Socket } from "socket.io-client";

class DailyFeedbackService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async isAlreadyProvidedFeedback(category: string, user: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getUserFeedbacksByCondition', { category, user });

            this.socket.on('getUserFeedbacksByConditionSuccess', (data: boolean) => {
                resolve(data);
            });

            this.socket.on('getUserFeedbacksByConditionError', (error: any) => {
                reject(new Error(error.message || 'Failed to check if already voted'));
            });
        });
    }
}

export default DailyFeedbackService;
