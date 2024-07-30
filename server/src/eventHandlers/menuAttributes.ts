import { Socket } from 'socket.io';
import MenuAttributesController from '../controllers/menuAttributes';


export default class MenuAttributesEventHandler {
    private socket: Socket;
    private menuAttributesController: MenuAttributesController;

    constructor(socket: Socket) {
        this.socket = socket;
        this.menuAttributesController = new MenuAttributesController()
    }

    listen() {
        this.socket.on('createMenuAttribute', async (data) => {
            await this.menuAttributesController.createMenuAttribute(this.socket, data);
        });
        this.socket.on('getMenuAttributes', async () => {
            await this.menuAttributesController.getAllMenuAttributes(this.socket);
        });
        this.socket.on('getMenuAttribute', async (data) => {
            await this.menuAttributesController.getMenuAttribute(this.socket, data);
        });
        this.socket.on('updateMenuAttribute', async (data) => {
            await this.menuAttributesController.updateMenuAttribute(this.socket, data);
        });
        this.socket.on('deleteMenuAttribute', async (data) => {
            await this.menuAttributesController.deleteMenuAttribute(this.socket, data);
        });
    }
}
