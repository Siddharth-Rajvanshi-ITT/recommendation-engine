import { Socket } from "socket.io-client";
import { MenuItem } from "../types/menuItem.js";

class RecommendationService {
    getTopRecommendations(socket: Socket, menu_type: string) {
        return new Promise((resolve, reject) => {
            socket.emit('getRecommendedItems', { menu_type });

            socket.on('getRecommendedItemsSuccess', (data: MenuItem[]) => {
                resolve(data);
            });

            socket.on('getRecommendedItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch recommended menu items'));
            });
        });
    }
}

export default RecommendationService;