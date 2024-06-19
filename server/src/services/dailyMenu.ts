import DailyMenu from "../models/dailyMenu";

class DailyMenuService {
    async createDailyMenu(menu_date: Date, menu_type: 'breakfast' | 'lunch' | 'dinner', chef_id: number) {
        try {
            const dailyMenu = await DailyMenu.create({ menu_date, menu_type, chef_id });
            return dailyMenu;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenus() {
        try {
            const dailyMenus = await DailyMenu.findAll();
            return dailyMenus;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuById(menu_id: number) {
        try {
            const dailyMenu = await DailyMenu.findByPk(menu_id);
            if (!dailyMenu) {
                throw new Error("Daily menu not found");
            }
            return dailyMenu;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDailyMenu(menu_id: number, menu_date: Date, menu_type: 'breakfast' | 'lunch' | 'dinner', chef_id: number) {
        try {
            const dailyMenu = await DailyMenu.findByPk(menu_id);
            if (!dailyMenu) {
                throw new Error("Daily menu not found");
            }
            dailyMenu.menu_date = menu_date;
            dailyMenu.menu_type = menu_type;
            dailyMenu.chef_id = chef_id;
            await dailyMenu.save();
            return dailyMenu;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDailyMenu(menu_id: number) {
        try {
            const dailyMenu = await DailyMenu.findByPk(menu_id);
            if (!dailyMenu) {
                throw new Error("Daily menu not found");
            }
            await dailyMenu.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyMenuService;
