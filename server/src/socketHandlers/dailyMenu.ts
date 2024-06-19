import { Socket } from 'socket.io';
import DailyMenuService from '../services/dailyMenu';

class DailyMenuController {
    private dailyMenuService: DailyMenuService;

    constructor() {
        this.dailyMenuService = new DailyMenuService();
    }

    public createDailyMenu = async (socket: Socket, data: any): Promise<void> => {
        const { menu_date, menu_type, chef_id } = data;
        try {
            const dailyMenu = await this.dailyMenuService.createDailyMenu(menu_date, menu_type, chef_id);
            socket.emit('createDailyMenuSuccess', dailyMenu);
        } catch (error) {
            socket.emit('createDailyMenuError', { error: error.message });
        }
    };

    public getDailyMenus = async (socket: Socket): Promise<void> => {
        try {
            const dailyMenus = await this.dailyMenuService.getDailyMenus();
            socket.emit('getDailyMenusSuccess', dailyMenus);
        } catch (error) {
            socket.emit('getDailyMenusError', { error: error.message });
        }
    };

    public getDailyMenuById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const dailyMenu = await this.dailyMenuService.getDailyMenuById(+id);
            socket.emit('getDailyMenuByIdSuccess', dailyMenu);
        } catch (error) {
            socket.emit('getDailyMenuByIdError', { error: error.message });
        }
    };

    public updateDailyMenu = async (socket: Socket, data: any): Promise<void> => {
        const { id, menu_date, menu_type, chef_id } = data;
        try {
            const dailyMenu = await this.dailyMenuService.updateDailyMenu(+id, menu_date, menu_type, chef_id);
            socket.emit('updateDailyMenuSuccess', dailyMenu);
        } catch (error) {
            socket.emit('updateDailyMenuError', { error: error.message });
        }
    };

    public deleteDailyMenu = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.dailyMenuService.deleteDailyMenu(+id);
            socket.emit('deleteDailyMenuSuccess');
        } catch (error) {
            socket.emit('deleteDailyMenuError', { error: error.message });
        }
    };
}

export default DailyMenuController;
