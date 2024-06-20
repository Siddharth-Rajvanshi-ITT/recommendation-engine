import { Socket } from "socket.io";
import RecommendationSocketHandler from "../socketHandlers/recommendation";

const recommendationSocketHandler = new RecommendationSocketHandler();


export default class RecommendationEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("getRecommendedItems", async () => {
            await recommendationSocketHandler.getMenuItems(this.socket);
        });
    }
}

