import { Socket } from "socket.io-client";
import { DailyMenu } from '../types/dailyMenu.js'; 

class DailyMenuService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createDailyMenu(dailyMenu: DailyMenu): Promise<DailyMenu> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createDailyMenu', dailyMenu);

            this.socket.on('createDailyMenuSuccess', (data: DailyMenu) => {
                resolve(data);
            });

            this.socket.on('createDailyMenuError', (error: any) => {
                reject(new Error(error.message || 'Failed to create daily menu'));
            });
        });
    }

    public async deleteDailyMenu(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteDailyMenu', { id });

            this.socket.on('deleteDailyMenuSuccess', () => {
                resolve();
            });

            this.socket.on('deleteDailyMenuError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete daily menu'));
            });
        });
    }

    public async getDailyMenuById(id: number): Promise<DailyMenu> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenuById', { id });

            this.socket.on('getDailyMenuByIdSuccess', (data: DailyMenu) => {
                resolve(data);
            });

            this.socket.on('getDailyMenuByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu'));
            });
        });
    }

    public async getDailyMenus(): Promise<DailyMenu[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenus');

            this.socket.on('getDailyMenusSuccess', (data: DailyMenu[]) => {
                resolve(data);
            });

            this.socket.on('getDailyMenusError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menus'));
            });
        });
    }

    public async updateDailyMenu(id: number, dailyMenu: DailyMenu): Promise<DailyMenu> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateDailyMenu', { id, ...dailyMenu });

            this.socket.on('updateDailyMenuSuccess', (data: DailyMenu) => {
                resolve(data);
            });

            this.socket.on('updateDailyMenuError', (error: any) => {
                reject(new Error(error.message || 'Failed to update daily menu'));
            });
        });
    }
}

export default DailyMenuService;
