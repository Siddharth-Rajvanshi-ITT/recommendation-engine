import { io, Socket } from "socket.io-client";
import { MenuItem } from '../types/menuItem.js';

class MenuItemService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createMenuItem(menuItem: MenuItem): Promise<MenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createMenuItem', menuItem);

            this.socket.on('createMenuItemSuccess', (data: MenuItem) => {
                resolve(data);
            });

            this.socket.on('createMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to create menu item'));
            });
        });
    }

    public async getMenuItems(): Promise<MenuItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getMenuItems');

            this.socket.on('getMenuItemsSuccess', (data: MenuItem[]) => {
                resolve(data);
            });

            this.socket.on('getMenuItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch menu items'));
            });
        });
    }

    public async getMenuItemById(id: number): Promise<MenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getMenuItemById', { id });

            this.socket.on('getMenuItemByIdSuccess', (data: MenuItem) => {
                resolve(data);
            });

            this.socket.on('getMenuItemByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch menu item'));
            });
        });
    }

    public async updateMenuItem(id: number, menuItem: any): Promise<MenuItem> {
        return new Promise((resolve, reject) => {
            console.log(menuItem)
            this.socket.emit('updateMenuItem', { id, menuItem });

            this.socket.on('updateMenuItemSuccess', (data: MenuItem) => {
                resolve(data);
            });

            this.socket.on('updateMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to update menu item'));
            });
        });
    }

    public async deleteMenuItem(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteMenuItem', { id });

            this.socket.on('deleteMenuItemSuccess', () => {
                resolve();
            });

            this.socket.on('deleteMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete menu item'));
            });
        });
    }
}

export default MenuItemService;
