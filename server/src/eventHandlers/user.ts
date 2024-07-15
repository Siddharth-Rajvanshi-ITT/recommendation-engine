import { Socket } from 'socket.io';
import UserSocketHandler from '../controllers/user';


export default class UserEventHandler {
    private socket: Socket;
    private userSocketHandler: UserSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.userSocketHandler = new UserSocketHandler();
    }

    listen() {
        this.socket.on('createUser', async (data) => {
            await this.userSocketHandler.createUser(this.socket, data);
        });
        this.socket.on('getUsers', async () => {
            await this.userSocketHandler.getUsers(this.socket);
        });
        this.socket.on('getUserById', async (data) => {
            await this.userSocketHandler.getUserById(this.socket, data);
        });
        this.socket.on('updateUser', async (data) => {
            await this.userSocketHandler.updateUser(this.socket, data);
        });
        this.socket.on('deleteUser', async (data) => {
            await this.userSocketHandler.deleteUser(this.socket, data);
        });
    }
}
