import inquirer from 'inquirer';
import MenuItemService from '../services/menuItem.js';
import NotificationService from '../services/notification.js';
import { MenuItem } from '../types/menuItem.js';
import { Socket } from 'socket.io-client';


let menuItemService: MenuItemService
let notificationService: NotificationService

class AdminCommands {
    async displayMenu(io: Socket): Promise<void> {
        menuItemService = new MenuItemService(io);
        notificationService = new NotificationService(io);

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose an admin command:',
                choices: [
                    { name: 'Add Menu Item', value: 'addMenuItem' },
                    { name: 'Update Menu Item', value: 'updateMenuItem' },
                    { name: 'Delete Menu Item', value: 'deleteMenuItem' },
                    { name: 'Exit', value: 'exit' },

                ],
            },
        ]);

        switch (answers.command) {
            case 'addMenuItem':
                await this.addMenuItem();
                break;
            case 'updateMenuItem':
                await this.updateMenuItem();
                break;
            case 'deleteMenuItem':
                await this.deleteMenuItem();
                break;
            case 'exit': return;

            default:
                console.log('Invalid command.');
        }

        this.displayMenu(io);
    }

    async addMenuItem(): Promise<void> {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Enter menu item name:' },
            { type: 'input', name: 'description', message: 'Enter menu item description:' },
            { type: 'list', name: 'category', message: 'Select menu item category:', choices: ['breakfast', 'lunch', 'dinner'] },
            { type: 'input', name: 'price', message: 'Enter menu item price:' },
            { type: 'list', name: 'availability_status', message: 'Select availability status:', choices: ['available', 'unavailable'] },
        ]);

        const newItem: MenuItem = {
            name: answers.name,
            description: answers.description,
            category: answers.category,
            price: parseFloat(answers.price),
            availability_status: answers.availability_status,
        };

        try {
            const menuItem = await menuItemService.createMenuItem(newItem);
            console.log('Menu item added successfully:', menuItem);
        } catch (error: any) {
            console.error('Failed to add menu item:', error.message);
        }
    }

    async updateMenuItem(): Promise<void> {
        const { id } = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'Enter the ID of the menu item to update:' },
        ]);

        const answers = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Enter new menu item name:' },
            { type: 'input', name: 'description', message: 'Enter new menu item description:' },
            { type: 'list', name: 'category', message: 'Select new menu item category:', choices: ['breakfast', 'lunch', 'dinner', 'beverage'] },
            { type: 'input', name: 'price', message: 'Enter new menu item price:' },
            { type: 'list', name: 'availability_status', message: 'Select new availability status:', choices: ['available', 'unavailable'] },
        ]);

        const updatedItem: MenuItem = {
            name: answers.name,
            description: answers.description,
            category: answers.category,
            price: parseFloat(answers.price),
            availability_status: answers.availability_status,
        };

        try {
            const menuItem = await menuItemService.updateMenuItem(+id, updatedItem);
            console.log('Menu item updated successfully:', menuItem);
        } catch (error: any) {
            console.error('Failed to update menu item:', error.message);
        }
    }

    async deleteMenuItem(): Promise<void> {
        const { id } = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'Enter the ID of the menu item to delete:' },
        ]);

        try {
            await menuItemService.deleteMenuItem(+id);
            console.log('Menu item deleted successfully.');
        } catch (error: any) {
            console.error('Failed to delete menu item:', error.message);
        }
    }

}

export default AdminCommands;