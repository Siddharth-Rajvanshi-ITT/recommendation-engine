import { Socket } from 'socket.io';
import MenuItemService from '../services/menuItem';

class RecommendationController {
    private menuItemService: MenuItemService;

    constructor() {
        this.menuItemService = new MenuItemService();
    }

    public getMenuItems = async (socket: Socket): Promise<void> => {
        try {
            const menuItems = await this.menuItemService.getMenuItems();
            socket.emit('getRecommendedItemsSuccess', menuItems);
        } catch (error) {
            socket.emit('getRecommendedItemsError', { error: error.message });
        }
    };
}

export default RecommendationController;
