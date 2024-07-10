import { Socket } from "socket.io";
import AuthSocketHandler from "../controllers/auth";

const authSocketHandler = new AuthSocketHandler();


export default class AuthEventHandler {
    private socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("login", async (data) => {
            await authSocketHandler.login(this.socket, data);
        });
    }
}

