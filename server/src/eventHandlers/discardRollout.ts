import { Socket } from 'socket.io';
import DiscardRollOutController from '../controllers/discardRollout';


export default class DiscardRollOutEventHandler {
    private socket: Socket;
    private discardRollOutController: DiscardRollOutController;

    constructor(socket: Socket) {
        this.socket = socket;
        this.discardRollOutController = new DiscardRollOutController();
    }

    listen() {
        this.socket.on('createDiscardRollOut', async (data) => {
            await this.discardRollOutController.createDiscardRollOut(this.socket, data);
        });
        this.socket.on('canCreateDiscardRollOut', async (data) => {
            await this.discardRollOutController.canCreateDiscardRollOut(this.socket);
        });
        this.socket.on('getDiscardRollOuts', async () => {
            await this.discardRollOutController.getDiscardRollOuts(this.socket);
        });
        this.socket.on('getDiscardRollOutById', async (data) => {
            await this.discardRollOutController.getDiscardRollOutById(this.socket, data);
        });
        this.socket.on('getDiscardRollOutByDate', async (data) => {
            await this.discardRollOutController.getDiscardRollOutByDate(this.socket);
        });
        this.socket.on('updateDiscardRollOut', async (data) => {
            await this.discardRollOutController.updateDiscardRollOut(this.socket, data);
        });
        this.socket.on('deleteDiscardRollOut', async (data) => {
            await this.discardRollOutController.deleteDiscardRollOut(this.socket, data);
        });
    }
}
