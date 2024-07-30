import { Socket } from 'socket.io';
import DailyRolloutService from '../services/dailyRollout';

class DailyRolloutController {
    private dailyRolloutService: DailyRolloutService;
    public createDailyRollout = async (socket: Socket, data: any): Promise<void> => {
        const { menu_type, date } = data;
        console.log('createDailyRollout', menu_type, date);
        try {
            const dailyRollout = await this.dailyRolloutService.createDailyRollout(menu_type, date);
            socket.emit('createDailyRolloutSuccess', dailyRollout);
        } catch (error) {
            socket.emit('createDailyRolloutError', { error: error.message });
        }
    };
    public deleteDailyRollout = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.dailyRolloutService.deleteDailyRollout(id);
            socket.emit('deleteDailyRolloutSuccess');
        } catch (error) {
            socket.emit('deleteDailyRolloutError', { error: error.message });
        }
    };
    public getDailyRolloutByDate = async (socket: Socket, data: any): Promise<void> => {
        const { date } = data;
        try {
            const dailyRollout = await this.dailyRolloutService.getDailyRolloutByDate(date);
            socket.emit('getDailyRolloutByDateSuccess', dailyRollout);
        } catch (error) {
            socket.emit('getDailyRolloutByDateError', { error: error.message });
        }
    };
    public getDailyRolloutById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const dailyRollout = await this.dailyRolloutService.getDailyRolloutById(id);
            socket.emit('getDailyRolloutByIdSuccess', dailyRollout);
        } catch (error) {
            socket.emit('getDailyRolloutByIdError', { error: error.message });
        }
    };
    public getDailyRollouts = async (socket: Socket): Promise<void> => {
        try {
            const dailyRollouts = await this.dailyRolloutService.getDailyRollouts();
            socket.emit('getDailyRolloutsSuccess', dailyRollouts);
        } catch (error) {
            socket.emit('getDailyRolloutsError', { error: error.message });
        }
    };
    public updateDailyRollout = async (socket: Socket, data: any): Promise<void> => {
        const { menu_type, date } = data;
        try {
            const dailyRollout = await this.dailyRolloutService.updateDailyRollout(menu_type, date);
            socket.emit('updateDailyRolloutSuccess', dailyRollout);
        } catch (error) {
            socket.emit('updateDailyRolloutError', { error: error.message });
        }
    };

    constructor() {
        this.dailyRolloutService = new DailyRolloutService();
    }
}

export default DailyRolloutController;
