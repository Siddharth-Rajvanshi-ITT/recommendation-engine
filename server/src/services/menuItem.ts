import MenuItem from "../models/menuItem";

class MenuItemService {
    async createMenuItem(name: string, description: string, category: 'breakfast' | 'lunch' | 'dinner', price: number, availability_status: 'available' | 'unavailable') {
        try {
            const menuItem = await MenuItem.create({ name, description, category, price, availability_status });
            return menuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMenuItems() {
        try {
            const menuItems = await MenuItem.findAll();
            return menuItems;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMenuItemById(item_id: number) {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            return menuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateMenuItem(item_id: number, name: string, description: string, category: 'breakfast' | 'lunch' | 'dinner', price: number, availability_status: 'available' | 'unavailable') {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            menuItem.name = name;
            menuItem.description = description;
            menuItem.category = category;
            menuItem.price = price;
            menuItem.availability_status = availability_status;
            await menuItem.save();
            return menuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteMenuItem(item_id: number) {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            await menuItem.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateMenuItemAvailability(item_id: number, availability_status: 'available' | 'unavailable') {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            menuItem.availability_status = availability_status;
            await menuItem.save();
            return menuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default MenuItemService;
