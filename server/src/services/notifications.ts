import MenuItem from "src/models/menuItem";
import Notification from "../models/notifications";
import MenuItemService from "./menuItem";
import MenuAttributesService from "./menuAttributes";
import EmployeePreferencesService from "./employeePreferences";

const menuItemService = new MenuItemService()
const menuAttributesService = new MenuAttributesService()
const employeePreferencesService = new EmployeePreferencesService()


class NotificationService {
    async createNotification(notification_type: 'new_breakfast_menu' | 'new_lunch_menu' | 'new_dinner_menu' | 'item_added' | 'item_status_change', notification_data: any, notification_timestamp: string) {
        try {
            const notification = await Notification.create({
                notification_type,
                notification_data,
                notification_timestamp,
            });
            return notification;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteNotification(notification_id: number) {
        try {
            const notification = await Notification.findByPk(notification_id);
            if (!notification) {
                throw new Error("Notification not found");
            }
            await notification.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getNotificationByDate(user: any) {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const notification_timestamp = tomorrow.toISOString().split('T')[0];
            const notifications = await Notification.findAll({ where: { notification_timestamp } });

            if (!notifications) {
                throw new Error("Notification not found");
            }

            const menuItemIds = notifications.flatMap(notification => notification.notification_data as number[]);
            const menuItems = await menuItemService.getMenuItemByIds(menuItemIds) as any[];
            const menuItemMap = new Map(menuItems.map(item => [item.item_id, item]));
            const employeePreferences = await employeePreferencesService.getEmployeePreference(user.id)

            const notificationsWithDetails = Promise.all(notifications.map(async (notification) => {
                const detailedItems = await Promise.all((notification.notification_data as number[]).map(async (id) => {
                    const menuItem = menuItemMap.get(id)
                    const menuAttributes = await menuAttributesService.getMenuAttribute(menuItem.item_id)
                    
                    return {
                        item_id: menuItem.item_id,
                        name: menuItem.name,
                        description: menuItem.description,
                        category: menuItem.category,
                        price: menuItem.price,
                        spiceLevel: menuAttributes.spiceLevel,
                        mealType: menuAttributes.mealType,
                        sweetTooth: menuAttributes.sweetTooth,
                        region: menuAttributes.category
                    }
                }));
                return {
                    ...notification.get({ plain: true }),
                    notification_data: await this.sortPreferences(employeePreferences, detailedItems),
                    recommendation: `You might like ${detailedItems[0].name} as you like ${employeePreferences.spiceLevel} spicy food`
                };
            }));

            return notificationsWithDetails;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    private sortPreferences(employeePreferences, menuItems) {
        return new Promise((resolve) => {
            const sortItems = (a, b) => {
                if (a.mealType !== b.mealType) {
                    console.log('Sorting by meal type')
                    if (a.mealType === employeePreferences.mealType) return -1;
                    if (b.mealType === employeePreferences.mealType) return 1;
                }
                if (a.spiceLevel !== b.spiceLevel) {
                    console.log('Sorting by spice level')
                    if (a.spiceLevel === employeePreferences.spiceLevel) return -1;
                    if (b.spiceLevel === employeePreferences.spiceLevel) return 1;
                }
                if (a.region !== b.region) {
                    console.log('Sorting by category')
                    if (a.region === employeePreferences.category) return -1;
                    if (b.region === employeePreferences.category) return 1;
                }
                if (a.sweetTooth !== b.sweetTooth) {
                    console.log('Sorting by sweet tooth')
                    if (a.sweetTooth === employeePreferences.sweetTooth) return -1;
                    if (b.sweetTooth === employeePreferences.sweetTooth) return 1;
                }
                return 0;
            };
    
            const sortedItems = menuItems.sort(sortItems);  
            resolve(sortedItems);
        });
    }
    

    async getNotificationById(notification_id: number) {
        try {
            const notification = await Notification.findByPk(notification_id);
            if (!notification) {
                throw new Error("Notification not found");
            }
            return notification;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getNotifications() {
        try {
            const notifications = await Notification.findAll();
            return notifications;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateNotification(notification_id: number, notification_type: 'new_breakfast_menu' | 'new_lunch_menu' | 'new_dinner_menu' | 'item_added' | 'item_status_change', notification_data: any, notification_timestamp: string) {
        try {
            const notification = await Notification.findByPk(notification_id);
            if (!notification) {
                throw new Error("Notification not found");
            }
            notification.notification_type = notification_type;
            notification.notification_data = notification_data;
            notification.notification_timestamp = notification_timestamp;
            await notification.save();
            return notification;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default NotificationService;
