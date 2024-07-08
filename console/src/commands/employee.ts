import inquirer from 'inquirer';
import MenuItemService from '../services/menuItem.js';
import FeedbackService from '../services/feedback.js';
import NotificationService from '../services/notification.js';
import VoteItemService from '../services/voteItem.js';
import { MenuItem } from '../types/menuItem.js';
import { Notification } from '../types/notification.js';
import { Socket } from 'socket.io-client';
import DailyMenuItemService from '../services/dailyMenuItem.js';
import DailyFeedbackService from '../services/dailyUserFeedback.js';

let menuItemService: MenuItemService
let notificationService: NotificationService
let feedbackService: FeedbackService
let voteItemService: VoteItemService
let dailyMenuItemService: DailyMenuItemService
let dailyFeedbackService: DailyFeedbackService


class EmployeeCommands {

    private static instance: EmployeeCommands;

    private constructor() { }

    public static getInstance(): EmployeeCommands {
        if (!EmployeeCommands.instance) {
            EmployeeCommands.instance = new EmployeeCommands();
        }
        return EmployeeCommands.instance;
    }

    async displayMenu(io: Socket, user: any) {

        console.log('Welcome to the Employee Portal!')


        menuItemService = new MenuItemService(io);
        notificationService = new NotificationService(io);
        feedbackService = new FeedbackService(io);
        voteItemService = new VoteItemService(io)
        dailyMenuItemService = new DailyMenuItemService(io)
        dailyFeedbackService = new DailyFeedbackService(io)

        while (true) {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'command',
                    message: 'Choose an action:',
                    choices: [
                        { name: 'View Menu', value: 'viewMenu' },
                        { name: 'Give Feedback', value: 'giveFeedback' },
                        { name: 'View Notifications', value: 'viewNotifications' },
                        { name: 'Choose Items for Upcoming Meal', value: 'chooseItemsForUpcomingMeal' },
                        { name: 'Exit', value: 'exit' },
                    ],
                },
            ]);

            switch (answer.command) {
                case 'viewMenu':
                    await this.viewMenu();
                    break;
                case 'giveFeedback':
                    await this.giveFeedback(user);
                    break;
                case 'viewNotifications':
                    await this.viewNotifications();
                    break;
                case 'chooseItemsForUpcomingMeal':
                    await this.chooseItemsForUpcomingMeal(user);
                    break;
                case 'exit': console.log('exiting');
                    process.exit(0);

                default:
                    console.log('Unknown command');
            }
        }
    }

    async viewMenu() {

        console.log('Inside viewMenu')
        try {
            const menuItems: MenuItem[] = await menuItemService.getMenuItems();
            const displayableMenuItems = menuItems.map(item => {
                return {
                    ID: item.item_id,
                    Name: item.name,
                    Description: item.description,
                    Category: item.category,
                    Price: item.price,
                    Availability: item.availability_status,
                }
            });

            console.log('--- Menu ---');
            console.table(displayableMenuItems)
        } catch (error: any) {
            console.error('Error fetching menu items:', error.message);
        }
    }

    async giveFeedback(user: any) {

        try {

            console.log('User:', user)

            console.log('Inside giveFeedback')
            const currentDate = new Date().toISOString().split('T')[0];

            const dailyMenuItems = await dailyMenuItemService.getDailyMenuItemByDate(currentDate);

            console.log('--- Daily Menu Items ---', dailyMenuItems);

            console.table(dailyMenuItems)

            const selectedItem = await this.promptUserForFeedbackItems(dailyMenuItems as any);


            const isAlreadyProvidedFeedback = await dailyFeedbackService.isAlreadyProvidedFeedback(selectedItem.category, user);

            if (isAlreadyProvidedFeedback) {
                console.log(`You have already voted for ${selectedItem.name}`);
                return;
            }

            const employeeFeedback = await this.promptFeedback();

            console.log('selectedItem:', selectedItem)
            

            const feedback = {
                item_id: parseInt(selectedItem.id),
                user_id: parseInt(user.id),
                rating: +employeeFeedback.rating,
                comment: employeeFeedback.comment,
                feedback_date: new Date().toISOString().split('T')[0],
            };

            await feedbackService.createFeedback(feedback.item_id, feedback.user_id, feedback.rating, feedback.comment, feedback.feedback_date, selectedItem.category);
            console.log('Feedback submitted successfully');
        } catch (error: any) {
            console.error('Error submitting feedback:', error.message);
        }
    }

    private async promptUserForFeedbackItems(filteredItems: any[]) {
        const choices = filteredItems.map(item => {
            return {
                name: `${item.name}`,
                value: item
            }
        });

        const { selectedItem } = await inquirer.prompt([
            { type: 'list', name: 'selectedItem', message: 'Select items for the upcoming meal:', choices },
        ]);

        return selectedItem;
    }

    private async promptMenuType(): Promise<string> {
        const { menu_type } = await inquirer.prompt([
            {
                type: 'list',
                name: 'menu_type',
                message: 'Select menu type:',
                choices: ['breakfast', 'lunch', 'dinner']
            },
        ]);

        return menu_type;
    }

    private async promptFeedback(): Promise<{rating: number, comment: string}> {
        const feedback = await inquirer.prompt([
            { type: 'input', name: 'rating', message: 'Enter your rating (1-5):' },
            { type: 'input', name: 'comment', message: 'Enter your feedback:' },
        ]);
        return feedback;
    }

    public async viewNotifications(): Promise<void> {
        try {
            const currentDate = this.getCurrentDate();
            const notifications = await this.fetchNotifications(currentDate);
            const rolledOutItems = this.processNotifications(notifications);

            if (rolledOutItems.length === 0) return;

            this.displayNotifications(rolledOutItems);

        } catch (error: any) {
            console.error(error.message);
        }
    }

    private getCurrentDate(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const menu_date = tomorrow.toISOString().split('T')[0];

        return menu_date;
    }

    private async fetchNotifications(date: string): Promise<Notification[]> {
        try {
            const notifications = await notificationService.getNotificationsByDate(date);
            if (!notifications || notifications.length === 0) {
                console.log('No notifications found');
                return [];
            }
            return notifications as any;
        } catch (error: any) {
            throw new Error('Error fetching notifications: ' + error.message);
        }
    }

    private processNotifications(notifications: Notification[]): any[] {
        return notifications.map((notification: Notification) => {
            return notification.notification_data.map((menuItem: any) => {
                return {
                    notification_type: notification.notification_type,
                    item_details: {
                        id: menuItem.item_id,
                        name: menuItem.name,
                        description: menuItem.description,
                        category: menuItem.category,
                        price: menuItem.price,
                    }
                }
            });
        });
    }

    private displayNotifications(rolledOutItems: any[]): void {
        console.log('--- Notifications ---');
        rolledOutItems.forEach((items: any) => {
            if (items.length) {
                console.log(`Tomorrow's rolled out items for ${items[0]?.item_details.category}:`);
                console.table(items.map((item: any) => item.item_details));
            }
        });
    }

    public async chooseItemsForUpcomingMeal(user: any): Promise<void> {
        try {
            const currentDate = this.getCurrentDate();
            const notifications = await this.fetchNotifications(currentDate);
            const rolledOutItems = this.processNotifications(notifications);

            if (rolledOutItems.length === 0) {
                console.log('No items rolled out for tomorrow. Please try again later.');
                return;
            }

            this.displayNotifications(rolledOutItems);

            const selectedCategory = await this.getCategoryChoice(rolledOutItems);

            const isAlreadyVoted = await voteItemService.isAlreadyVoted(selectedCategory, user);

            if (isAlreadyVoted) {
                console.log(`You have already voted for ${selectedCategory} meal`);
                return;
            }

            const filteredItems = this.filterItemsByCategory(rolledOutItems, selectedCategory);
            const selectedItem = await this.promptUserForItems(filteredItems);

            await voteItemService.vote(selectedItem, user)

            console.log(`Your meal choice for ${selectedCategory} have been recorded`);
        } catch (error: any) {
            console.error('Error selecting items for the upcoming meal:', error.message);
        }
    }

    private async getCategoryChoice(rolledOutItems: any[]): Promise<string> {
        const categoryChoice = rolledOutItems.map(rolledOutItem => {
            const category = rolledOutItem[0].notification_type === 'new_breakfast_menu' ? 'breakfast' : rolledOutItem[0].notification_type === 'new_lunch_menu' ? 'lunch' : 'dinner';
            return {
                name: `${category}`,
                value: category,
            };
        });

        const { selectedCategory } = await inquirer.prompt([
            { type: 'list', name: 'selectedCategory', message: 'Select category to choose item from:', choices: categoryChoice },
        ]);

        return selectedCategory;
    }

    private filterItemsByCategory(rolledOutItems: any[], selectedCategory: string): any[] {
        return rolledOutItems
            .flat()
            .filter(item => {
                const category = item.notification_type === 'new_breakfast_menu' ? 'breakfast' : item.notification_type === 'new_lunch_menu' ? 'lunch' : 'dinner';
                return category === selectedCategory;
            })
            .map(item => item.item_details);
    }

    private async promptUserForItems(filteredItems: any[]) {
        const choices = filteredItems.map(item => {
            return {
                name: `${item.name} (Category: ${item.category}, Price: ${item.price})`,
                value: item,
            }
        });

        const { selectedItem } = await inquirer.prompt([
            { type: 'list', name: 'selectedItem', message: 'Select items for the upcoming meal:', choices },
        ]);

        return selectedItem;
    }


}

export default EmployeeCommands.getInstance();
