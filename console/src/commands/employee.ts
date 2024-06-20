import inquirer from 'inquirer';
import MenuItemService from '../services/menuItem.js';
import FeedbackService from '../services/feedback.js';
import NotificationService from '../services/notification.js';
import { MenuItem } from '../types/menuItem.js';
import { Notification } from '../types/notification.js';
import { Socket } from 'socket.io-client';

let menuItemService: MenuItemService
let notificationService: NotificationService
let feedbackService: FeedbackService


class EmployeeCommands {

    async displayMenu(io: Socket, user: any) {

        menuItemService = new MenuItemService(io);
        notificationService = new NotificationService(io);
        feedbackService = new FeedbackService(io);

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
                console.log('after viewMenu');
                break;
            case 'giveFeedback':
                await this.giveFeedback();
                console.log('after giveFeedback');
                break;
            case 'viewNotifications': 
                await this.viewNotifications(parseInt(user.id));
                console.log('after viewNotifications');
                break;
            case 'chooseItemsForUpcomingMeal':
                await this.chooseItemsForUpcomingMeal();
                console.log('after chooseItemsForUpcomingMeal');
                break;
            case 'exit':  console.log('exiting');
            return;

            default:
                console.log('Unknown command');
        }

    }

    async viewMenu() {

        console.log('Inside viewMenu')
        try {
            const menuItems: MenuItem[] = await menuItemService.getMenuItems();
            console.log('--- Menu ---');
            menuItems.forEach(item => {
                console.log(`ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Category: ${item.category}, Price: ${item.price}, Availability: ${item.availability_status}`);
            });
        } catch (error: any) {
            console.error('Error fetching menu items:', error.message);
        }
    }

    async giveFeedback() {
        
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'item_id', message: 'Enter the ID of the menu item:' },
                { type: 'input', name: 'rating', message: 'Enter your rating (1-5):' },
                { type: 'input', name: 'comment', message: 'Enter your feedback:' },
                { type: 'input', name: 'user_id', message: 'Enter your user ID:' },
            ]);

            const feedback = {
                item_id: parseInt(answers.item_id),
                user_id: parseInt(answers.user_id),
                rating: parseInt(answers.rating),
                comment: answers.comment,
                feedback_date: new Date(),
            };

            await feedbackService.createFeedback(feedback.item_id, feedback.user_id, feedback.rating, feedback.comment, feedback.feedback_date);
            console.log('Feedback submitted successfully');
        } catch (error: any) {
            console.error('Error submitting feedback:', error.message);
        }
    }

    async viewNotifications(user_id: number) {
        try {
            const notifications = await notificationService.getNotificationById(user_id) as any;
            console.log('--- Notifications ---');
            notifications.forEach((notification: Notification) => {
                console.log(`Type: ${notification.notification_type}, Data: ${JSON.stringify(notification.notification_data)}, Timestamp: ${notification.notification_timestamp}`);
            });
        } catch (error: any) {
            console.error('Error fetching notifications:', error.message);
        }
    }

    async chooseItemsForUpcomingMeal() {
        try {
            const menuItems: MenuItem[] = await menuItemService.getMenuItems();
            const choices = menuItems.map(item => ({
                name: `${item.name} (Category: ${item.category}, Price: ${item.price})`,
                value: item.id,
            }));

            const answers = await inquirer.prompt([
                { type: 'checkbox', name: 'selectedItems', message: 'Select items for the upcoming meal:', choices },
                { type: 'input', name: 'user_id', message: 'Enter your user ID:' },
            ]);

            const selectedItems = answers.selectedItems as number[];
            const user_id = parseInt(answers.user_id);

            console.log('Your meal choices have been recorded.');
        } catch (error: any) {
            console.error('Error selecting items for the upcoming meal:', error.message);
        }
    }


}

export default EmployeeCommands;
