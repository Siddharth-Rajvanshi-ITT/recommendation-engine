import { Socket } from 'socket.io';
import RecommendationSocketHandler from '../controllers/recommendation';

export default class RecommendationEventHandler {
    private socket: Socket;
    private recommendationSocketHandler: RecommendationSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.recommendationSocketHandler = new RecommendationSocketHandler();
    }

    listen() {
        this.socket.on('getRecommendedItems', async (data) => {
            const { menu_type } = data;
            await this.recommendationSocketHandler.getRecommendedMenuItems(this.socket, menu_type);
        });

        this.socket.on('getDiscardableItems', async (data) => {
            const { menu_type } = data;
            await this.recommendationSocketHandler.getDiscardableMenuItems(this.socket, menu_type);
        });

        this.socket.on('discardItem', async (data) => {
            console.log(data);
            const { items: selectedItems } = data;
            await this.recommendationSocketHandler.discardMenuItems(this.socket, selectedItems);
        });
    }
}
