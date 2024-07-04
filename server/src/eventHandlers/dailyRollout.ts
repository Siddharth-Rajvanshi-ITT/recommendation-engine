import { Socket } from "socket.io";
import DailyRolloutSocketHandler from "../controllers/dailyRollout";

const dailyRolloutSocketHandler = new DailyRolloutSocketHandler();

export default class DailyRolloutEventHandler {
    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on("createDailyRollout", async (data) => {
            await dailyRolloutSocketHandler.createDailyRollout(this.socket, data);
        });
        this.socket.on("getDailyRollouts", async () => {
            await dailyRolloutSocketHandler.getDailyRollouts(this.socket);
        });
        this.socket.on("getDailyRolloutById", async (data) => {
            await dailyRolloutSocketHandler.getDailyRolloutById(this.socket, data);
        });
        this.socket.on("getDailyRolloutByDate", async (data) => {
            await dailyRolloutSocketHandler.getDailyRolloutByDate(this.socket, data);
        });
        this.socket.on("updateDailyRollout", async (data) => {
            await dailyRolloutSocketHandler.updateDailyRollout(this.socket, data);
        });
        this.socket.on("deleteDailyRollout", async (data) => {
            await dailyRolloutSocketHandler.deleteDailyRollout(this.socket, data);
        });
    }
}
