import { Socket } from 'socket.io';
import MenuItemService from '../services/menuItem';

class MenuItemController {
    private menuItemService: MenuItemService;

    constructor() {
        this.menuItemService = new MenuItemService();
    }

    public createMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { name, description, category, price, availability_status } = data;
        try {
            const menuItem = await this.menuItemService.createMenuItem(name, description, category, price, availability_status);
            socket.emit('createMenuItemSuccess', menuItem);
        } catch (error) {
            socket.emit('createMenuItemError', { error: error.message });
        }
    };

    public getMenuItems = async (socket: Socket): Promise<void> => {
        try {
            const menuItems = await this.menuItemService.getMenuItems();
            socket.emit('getMenuItemsSuccess', menuItems);
        } catch (error) {
            socket.emit('getMenuItemsError', { error: error.message });
        }
    };

    public getMenuItemById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const menuItem = await this.menuItemService.getMenuItemById(+id);
            socket.emit('getMenuItemByIdSuccess', menuItem);
        } catch (error) {
            socket.emit('getMenuItemByIdError', { error: error.message });
        }
    };

    public getMenuItemByIds = async (socket: Socket, data: any): Promise<void> => {
        const { item_ids } = data;
        try {
            const menuItem = await this.menuItemService.getMenuItemByIds(item_ids);
            socket.emit('getMenuItemByIdsSuccess', menuItem);
        } catch (error) {
            socket.emit('getMenuItemByIdsError', { error: error.message });
        }
    };


    public updateMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const id = data.id;
        const { name, description, category, price, availability_status } = data.menuItem;

        try {
            const menuItem = await this.menuItemService.updateMenuItem(+id, name, description, category, price, availability_status);
            socket.emit('updateMenuItemSuccess', menuItem);
        } catch (error) {
            socket.emit('updateMenuItemError', { error: error.message });
        }
    };

    public deleteMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.menuItemService.deleteMenuItem(+id);
            socket.emit('deleteMenuItemSuccess');
        } catch (error) {
            socket.emit('deleteMenuItemError', { error: error.message });
        }
    };

    public updateMenuItemAvailability = async (socket: Socket, data: any): Promise<void> => {
        const { id, availability_status } = data;
        try {
            const menuItem = await this.menuItemService.updateMenuItemAvailability(+id, availability_status);
            socket.emit('updateMenuItemAvailabilitySuccess', menuItem);
        } catch (error) {
            socket.emit('updateMenuItemAvailabilityError', { error: error.message });
        }
    };
}

export default MenuItemController;
