import { Socket } from "socket.io-client";
import { DailyMenuItem } from '../types/dailyMenuItem.js'; 

class DailyMenuItemService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createDailyMenuItem(menuItem: DailyMenuItem): Promise<DailyMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createDailyMenuItem', menuItem);

            this.socket.on('createDailyMenuItemSuccess', (data: DailyMenuItem) => {
                resolve(data);
            });

            this.socket.on('createDailyMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to create daily menu item'));
            });
        });
    }

    public async deleteDailyMenuItem(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteDailyMenuItem', { id });

            this.socket.on('deleteDailyMenuItemSuccess', () => {
                resolve();
            });

            this.socket.on('deleteDailyMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete daily menu item'));
            });
        });
    }

    public async getDailyMenuItemByDate(date: string): Promise<DailyMenuItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenuItemByDate', { date });

            this.socket.on('getDailyMenuItemByDateSuccess', (data: DailyMenuItem[]) => {
                resolve(data);
            });

            this.socket.on('getDailyMenuItemByDateError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu item'));
            });
        });
    }

    public async getDailyMenuItemById(id: number): Promise<DailyMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenuItemById', { id });

            this.socket.on('getDailyMenuItemByIdSuccess', (data: DailyMenuItem) => {
                resolve(data);
            });

            this.socket.on('getDailyMenuItemByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu item'));
            });
        });
    }

    public async getDailyMenuItems(): Promise<DailyMenuItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenuItems');

            this.socket.on('getDailyMenuItemsSuccess', (data: DailyMenuItem[]) => {
                resolve(data);
            });

            this.socket.on('getDailyMenuItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu items'));
            });
        });
    }

    public async updateDailyMenuItem(id: number, menuItem: DailyMenuItem): Promise<DailyMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateDailyMenuItem', { ...menuItem, id });

            this.socket.on('updateDailyMenuItemSuccess', (data: DailyMenuItem) => {
                resolve(data);
            });

            this.socket.on('updateDailyMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to update daily menu item'));
            });
        });
    }
}

export default DailyMenuItemService;
