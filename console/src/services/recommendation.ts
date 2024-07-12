import { Socket } from "socket.io-client";
import { MenuItem } from "../types/menuItem.js";

class RecommendationService {
    getDiscardableItems(socket: Socket, menu_type: string) {
        return new Promise((resolve, reject) => {
            socket.off('getDiscardableItemsSuccess')
            socket.off('getDiscardableItemsError')
            socket.emit('getDiscardableItems', { menu_type });

            socket.on('getDiscardableItemsSuccess', (data: MenuItem[]) => {
                resolve(data);
            });

            socket.on('getDiscardableItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch recommended menu items'));
            });
        });
    }

    getTopRecommendations(socket: Socket, menu_type: string) {
        return new Promise((resolve, reject) => {
            socket.off('getTopRecommendationsSuccess')
            socket.off('getTopRecommendationsError')
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