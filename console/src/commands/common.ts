import { Socket } from "socket.io-client";
import MenuItemService from "../services/menuItem.js";

let menuItemService: MenuItemService

class CommonCommands {
    async showMenuItems(io: Socket): Promise<void> {

        menuItemService = new MenuItemService(io);

        try {
            const menuItems = await menuItemService.getMenuItems();

            const menuItemsDiaplay = menuItems.map((item: any) => {
                return {
                    id: item.item_id,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    availability_status: item.availability_status
                }
            })


            console.table(menuItemsDiaplay);

            console.log('Menu item fetched successfully.');
        } catch (error: any) {
            console.error('Failed to fetch menu item:', error.message);
        }
    }
}

export default CommonCommands