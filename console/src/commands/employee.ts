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
import DiscardRollOutService from '../services/discardRollout.js';
import DiscardFeedbackService from '../services/discardFeedback.js';
import EmployeePreferencesService from '../services/employeePreferences.js';

let menuItemService: MenuItemService
let notificationService: NotificationService
let feedbackService: FeedbackService
let voteItemService: VoteItemService
let dailyMenuItemService: DailyMenuItemService
let dailyFeedbackService: DailyFeedbackService
let discardRollOutService: DiscardRollOutService
let discardFeedbackService: DiscardFeedbackService
let employeePreferencesService: EmployeePreferencesService


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
        discardRollOutService = new DiscardRollOutService(io)
        discardFeedbackService = new DiscardFeedbackService(io)
        employeePreferencesService = new EmployeePreferencesService(io);

        while (true) {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'command',
                    message: 'Choose an action:',
                    choices: [
                        { name: 'Update your profile preferences', value: 'updateProfile' },
                        { name: 'View Menu', value: 'viewMenu' },
                        { name: 'Give Feedback', value: 'giveFeedback' },
                        { name: 'View Notifications', value: 'viewNotifications' },
                        { name: 'Choose Items for Upcoming Meal', value: 'chooseItemsForUpcomingMeal' },
                        { name: 'Give feedback for discarding item', value: 'discardItemFeedback' },
                        { name: 'Exit', value: 'exit' },
                    ],
                },
            ]);

            switch (answer.command) {
                case 'updateProfile':
                    await this.updateProfile(user);
                    break;
                case 'viewMenu':
                    await this.viewMenu();
                    break;
                case 'giveFeedback':
                    await this.giveFeedback(user);
                    break;
                case 'viewNotifications':
                    await this.viewNotifications(user);
                    break;
                case 'chooseItemsForUpcomingMeal':
                    await this.chooseItemsForUpcomingMeal(user);
                    break;
                case 'discardItemFeedback':
                    await this.discardItemFeedback(user);
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
            const currentDate = new Date().toISOString().split('T')[0];
            const dailyMenuItems = await dailyMenuItemService.getDailyMenuItemByDate(currentDate);

            if (dailyMenuItems.length === 0) {
                console.log('No menu items found for today');
                return;
            }

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

    private async promptFeedback(): Promise<{ rating: number, comment: string }> {
        const feedback = await inquirer.prompt([
            { type: 'input', name: 'rating', message: 'Enter your rating (1-5):' },
            { type: 'input', name: 'comment', message: 'Enter your feedback:' },
        ]);
        return feedback;
    }

    public async viewNotifications(user: any): Promise<void> {
        try {
            const notifications = await this.fetchNotifications(user);
            console.log('--- Notifications ---', notifications)
            const rolledOutItems = this.processNotifications(notifications);

            if (rolledOutItems.length === 0) return;

            this.displayNotifications(rolledOutItems);

        } catch (error: any) {
            console.error(error.message);
        }
    }

    private async fetchNotifications(user: any): Promise<Notification[]> {
        try {
            const notifications = await notificationService.getNotificationsByDate(user);
            if (!notifications || notifications.length === 0) {
                console.log('No notifications found');
                return [];
            }
            return notifications as any;
        } catch (error: any) {
            throw new Error('Error fetching notifications: ' + error.message);
        }
    }

    private processNotifications(notifications: any): any[] {
        return notifications.map((notification: any) => {
            return notification.notification_data.map((menuItem: any) => {
                return {
                    notification_type: notification.notification_type,
                    recommendation: notification.recommendation,
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
            const notifications = await this.fetchNotifications(user);
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

    private async discardItemFeedback(user: any) {
        const discardRollOutItem = await this.showDiscardMenuItem();
        const isAlreadyProvidedFeedback = await discardFeedbackService.getDiscardFeedbacksByCondition(discardRollOutItem.item_id, user.id);

        if (isAlreadyProvidedFeedback) {
            console.log(`You have already provided feedback for ${discardRollOutItem.item_name}`);
            return;
        }

        const answers = await this.promptDiscardItemFeedback(discardRollOutItem);
        await discardFeedbackService.createDiscardFeedback(discardRollOutItem.item_id, user.id, answers.dislikeAboutItem, answers.desiredTaste, answers.momsRecipe);
    }

    private async showDiscardMenuItem() {
        const discardRollOutItem = await discardRollOutService.getDiscardRollOutByDate() as any;
        console.log('--- This Month\'s Discard Roll Out Item ---');
        console.table([discardRollOutItem])

        return discardRollOutItem;
    }

    private async promptDiscardItemFeedback(discardRollOutItem: any) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'dislikeAboutItem',
                message: `Q1. What didn’t you like about ${discardRollOutItem.item_name}?\n>`,
            },
            {
                type: 'input',
                name: 'desiredTaste',
                message: `Q2. How would you like ${discardRollOutItem.item_name} to taste?\n>`,
            },
            {
                type: 'input',
                name: 'momsRecipe',
                message: 'Q3. Share your mom’s recipe.\n>',
            },
        ]);

        return answers
    }

    private async updateProfile(user: any) {
        const preferences = await this.promptPreferences();
        await employeePreferencesService.updateEmployeePreference(user.id, preferences.mealType, preferences.spiceLevel, preferences.category, preferences.sweetTooth);
    }

    private async promptPreferences() {
        const preferences = await inquirer.prompt([
            {
                type: 'list',
                name: 'mealType',
                message: 'Please select meal type:',
                choices: [
                    { name: 'System Default', value: 'system_default' },
                    { name: 'Vegetarian', value: 'vegetarian' },
                    { name: 'Non Vegetarian', value: 'non-vegetarian' },
                    { name: 'Eggetarian', value: 'eggetarian' }
                ],
            },
            {
                type: 'list',
                name: 'spiceLevel',
                message: 'Please select your spice level:',
                choices: [
                    { name: 'System Default', value: 'system_default' },
                    { name: 'High', value: 'high' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Low', value: 'low' }
                ],
            },
            {
                type: 'list',
                name: 'category',
                message: 'What do you prefer most?',
                choices: [
                    { name: 'System Default', value: 'system_default' },
                    { name: 'North Indian', value: 'north indian' },
                    { name: 'South Indian', value: 'south indian' },
                    { name: 'Other', value: 'other' }
                ],
            },
            {
                type: 'list',
                name: 'sweetTooth',
                message: 'Do you have a sweet tooth?',
                choices: [
                    { name: 'System Default', value: false },
                    { name: 'Yes', value: true },
                    { name: 'No', value: false },
                ],
            },
        ]);
        return preferences;
    }


}

export default EmployeeCommands.getInstance();
