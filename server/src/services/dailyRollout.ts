import DailyRollout from "../models/dailyRollout";

class DailyRolloutService {
    async createDailyRollout(menu_type, date: string) {
        console.log('createDailyRollout', menu_type, date);
        try {
            let dailyRollout;

            if (menu_type === 'breakfast') {
                console.log('Creating dailyRollout - breakfast')
                dailyRollout = await DailyRollout.create({ breakfast: true, date });
            } else if (menu_type === 'lunch') {
                console.log('Creating dailyRollout - lunch')
                dailyRollout = await DailyRollout.create({ lunch: true, date });
            } else if (menu_type === 'dinner') {
                console.log('Creating dailyRollout - dinner')
                dailyRollout = await DailyRollout.create({ dinner: true, date });
            }

            return dailyRollout;
        } catch (error) {
            console.log('Error creating dailyRollout', error);
            throw new Error(error.message);
        }
    }

    async deleteDailyRollout(id: number) {
        try {
            const dailyRollout = await DailyRollout.findByPk(id);
            if (!dailyRollout) {
                throw new Error("DailyRollout not found");
            }
            await dailyRollout.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyRolloutByDate(date: string) {
        console.log('getDailyRolloutByDate', date);
        try {
            const dailyRollout = await DailyRollout.findOne({ where: { date } });
            console.log('dailyRollout', dailyRollout);
            return dailyRollout;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyRolloutById(id: number) {
        try {
            const dailyRollout = await DailyRollout.findByPk(id);
            if (!dailyRollout) {
                throw new Error("DailyRollout not found");
            }
            return dailyRollout;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyRollouts() {
        try {
            const dailyRollouts = await DailyRollout.findAll();
            return dailyRollouts;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDailyRollout(menu_type, date: string) {
        try {
            let dailyRollout;

            if (menu_type === 'breakfast') {
                dailyRollout = await DailyRollout.update({ breakfast: true }, { where: { date } });
            } else if (menu_type === 'lunch') {
                dailyRollout = await DailyRollout.update({ lunch: true }, { where: { date } });
            } else if (menu_type === 'dinner') {
                dailyRollout = await DailyRollout.update({ dinner: true }, { where: { date } });
            }

            return dailyRollout;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyRolloutService;
