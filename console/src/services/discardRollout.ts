import { Socket } from "socket.io-client";

class DiscardRollOutService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async canCreateDiscardRollOut(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.socket.emit('canCreateDiscardRollOut');

            this.socket.on('canCreateDiscardRollOutSuccess', (data: boolean) => {
                resolve(data);
            });

            this.socket.on('canCreateDiscardRollOutError', (error: any) => {
                reject(new Error(error.message || 'Failed to check if discard rollout can be created'));
            });
        });
    }

    public async createDiscardRollOut(item_id: number, item_name: string, price: number, date: string){
        return new Promise((resolve, reject) => {
            this.socket.emit('createDiscardRollOut', { item_id, item_name, price, date });

            this.socket.on('createDiscardRollOutSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('createDiscardRollOutError', (error: any) => {
                reject(new Error(error.message || 'Failed to create discard rollout'));
            });
        });
    }

    public async deleteDiscardRollOut(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteDiscardRollOut', { id });

            this.socket.on('deleteDiscardRollOutSuccess', () => {
                resolve();
            });

            this.socket.on('deleteDiscardRollOutError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete discard rollout'));
            });
        });
    }

    public async getDiscardRollOutByDate(){
        return new Promise((resolve, reject) => {
            this.socket.emit('getDiscardRollOutByDate');

            this.socket.on('getDiscardRollOutByDateSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getDiscardRollOutByDateError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard rollouts by date'));
            });
        });
    }

    public async getDiscardRollOutById(id: number){
        return new Promise((resolve, reject) => {
            this.socket.emit('getDiscardRollOutById', { id });

            this.socket.on('getDiscardRollOutByIdSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getDiscardRollOutByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard rollout by id'));
            });
        });
    }

    public async getDiscardRollOuts(){
        return new Promise((resolve, reject) => {
            this.socket.emit('getDiscardRollOuts');

            this.socket.on('getDiscardRollOutsSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getDiscardRollOutsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch discard rollouts'));
            });
        });
    }

    public async updateDiscardRollOut(id: number, item_id: number, item_name: string, price: number, date: string) {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateDiscardRollOut', { id, item_id, item_name, price, date });

            this.socket.on('updateDiscardRollOutSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('updateDiscardRollOutError', (error: any) => {
                reject(new Error(error.message || 'Failed to update discard rollout'));
            });
        });
    }
}

export default DiscardRollOutService;
