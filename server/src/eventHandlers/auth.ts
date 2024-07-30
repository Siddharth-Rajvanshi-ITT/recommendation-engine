import { Socket } from 'socket.io';
import AuthSocketHandler from '../controllers/auth';


export default class AuthEventHandler {
    private socket: Socket;
    private authSocketHandler: AuthSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.authSocketHandler = new AuthSocketHandler();
    }

    listen() {
        this.socket.on('login', async (data) => {
            await this.authSocketHandler.login(this.socket, data);
        });
    }
}
