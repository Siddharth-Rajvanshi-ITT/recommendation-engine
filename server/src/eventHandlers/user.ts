import { Socket } from "socket.io";
import UserSocketHandler from "../socketHandlers/user";

const userSocketHandler = new UserSocketHandler();

export default class UserEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createUser", async (data) => {
            await userSocketHandler.createUser(this.socket, data);
        });
        this.socket.on("getUsers", async () => {
            await userSocketHandler.getUsers(this.socket);
        });
        this.socket.on("getUserById", async (data) => {
            await userSocketHandler.getUserById(this.socket, data);
        });
        this.socket.on("updateUser", async (data) => {
            await userSocketHandler.updateUser(this.socket, data);
        });
        this.socket.on("deleteUser", async (data) => {
            await userSocketHandler.deleteUser(this.socket, data);
        });
    }
}

