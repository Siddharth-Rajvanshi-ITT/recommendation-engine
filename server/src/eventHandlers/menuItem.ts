import { Socket } from 'socket.io';
import MenuItemSocketHandler from '../controllers/menuItem';


export default class MenuItemEventHandler {
    private socket: Socket;
    private menuItemSocketHandler: MenuItemSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.menuItemSocketHandler = new MenuItemSocketHandler();
    }

    listen() {
        this.socket.on('createMenuItem', async (data) => {
            await this.menuItemSocketHandler.createMenuItem(this.socket, data);
        });
        this.socket.on('getMenuItems', async () => {
            await this.menuItemSocketHandler.getMenuItems(this.socket);
        });
        this.socket.on('getMenuItemById', async (data) => {
            await this.menuItemSocketHandler.getMenuItemById(this.socket, data);
        });
        this.socket.on('getMenuItemByIds', async (data) => {
            await this.menuItemSocketHandler.getMenuItemByIds(this.socket, data);
        });
        this.socket.on('updateMenuItem', async (data) => {
            await this.menuItemSocketHandler.updateMenuItem(this.socket, data);
        });
        this.socket.on('deleteMenuItem', async (data) => {
            await this.menuItemSocketHandler.deleteMenuItem(this.socket, data);
        });
        this.socket.on('updateMenuItemAvailability', async (data) => {
            await this.menuItemSocketHandler.updateMenuItemAvailability(this.socket, data);
        });
    }
}
