import { Socket } from "socket.io";
import DailyMenuSocketHandler from "../socketHandlers/dailyMenu";

const dailyMenuSocketHandler = new DailyMenuSocketHandler();

export default class DailyMenuEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createDailyMenu", async (data) => {
            await dailyMenuSocketHandler.createDailyMenu(this.socket, data);
        });
        this.socket.on("getDailyMenus", async () => {
            await dailyMenuSocketHandler.getDailyMenus(this.socket);
        });
        this.socket.on("getDailyMenuById", async (data) => {
            await dailyMenuSocketHandler.getDailyMenuById(this.socket, data);
        });
        this.socket.on("updateDailyMenu", async (data) => {
            await dailyMenuSocketHandler.updateDailyMenu(this.socket, data);
        });
        this.socket.on("deleteDailyMenu", async (data) => {
            await dailyMenuSocketHandler.deleteDailyMenu(this.socket, data);
        });
    }
}

