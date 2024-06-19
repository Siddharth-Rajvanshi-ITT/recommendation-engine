import DailyMenuItems from "../models/dailyMenuItems";

class DailyMenuItemsService {
    async createDailyMenuItem(menu_id: number, item_id: number, quantity_prepared: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.create({ menu_id, item_id, quantity_prepared });
            return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItems() {
        try {
            const dailyMenuItems = await DailyMenuItems.findAll();
            return dailyMenuItems;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItemById(id: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.findByPk(id);
            if (!dailyMenuItem) {
                throw new Error("Daily menu item not found");
            }
            return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDailyMenuItem(id: number, menu_id: number, item_id: number, quantity_prepared: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.findByPk(id);
            if (!dailyMenuItem) {
                throw new Error("Daily menu item not found");
            }
            dailyMenuItem.menu_id = menu_id;
            dailyMenuItem.item_id = item_id;
            dailyMenuItem.quantity_prepared = quantity_prepared;
            await dailyMenuItem.save();
            return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDailyMenuItem(id: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.findByPk(id);
            if (!dailyMenuItem) {
                throw new Error("Daily menu item not found");
            }
            await dailyMenuItem.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyMenuItemsService;
