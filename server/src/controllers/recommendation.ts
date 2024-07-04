import { Socket } from 'socket.io';
import RecommendationEngineService from 'src/services/recommendationEngine';

class RecommendationController {
    private recommendationEngineService: RecommendationEngineService;

    constructor() {
        this.recommendationEngineService = new RecommendationEngineService();
    }

    public async getRecommendedMenuItems(socket: Socket, menu_type) {
        try {
            const menuItems = await this.recommendationEngineService.getRecommendations(menu_type);
            socket.emit('getRecommendedItemsSuccess', menuItems);
        } catch (error) {
            socket.emit('getRecommendedItemsError', { error: error.message });
        }
    };
}

export default RecommendationController;
