import inquirer from 'inquirer';
import MenuItemService from '../services/menuItem.js';
import { MenuItem } from '../types/menuItem.js';
import { Socket } from 'socket.io-client';
import CommonCommands from './common.js';

let menuItemService: MenuItemService
const commonCommands = new CommonCommands()

class AdminCommands {

    private static instance: AdminCommands;

    private constructor() { }

    public static getInstance(): AdminCommands {
        if (!AdminCommands.instance) {
            AdminCommands.instance = new AdminCommands();
        }
        return AdminCommands.instance;
    }


    async displayMenu(io: Socket): Promise<void> {
        menuItemService = new MenuItemService(io);

        console.log('Welcome to the Admin Portal!')

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose an admin command:',
                choices: [
                    { name: 'Add Menu Item', value: 'addMenuItem' },
                    { name: 'See Menu Item', value: 'seeMenuItem' },
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
            case 'seeMenuItem':
                await commonCommands.showMenuItems(io);
                break;
            case 'exit': console.log('exiting');
                process.exit(0);

            default:
                console.log('Invalid command.');
        }

        await this.displayMenu(io);
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
            console.log('Menu item added successfully');
        } catch (error: any) {
            console.error('Failed to add menu item:', error.message);
        }
    }

    async updateMenuItem(): Promise<void> {
        const { id, choice } = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'Enter the ID of the menu item to update:' },
            {
                type: 'list', name: 'choice', message: 'What do you want to update:', choices: [
                    { name: 'Item Name', value: 'itemName' },
                    { name: 'Description', value: 'description' },
                    { name: 'Category', value: 'category' },
                    { name: 'Price', value: 'price' },
                    { name: 'Availability Status', value: 'availability_status' },
                ]
            },
        ]);

        let updatedItem = {}

        switch (choice) {
            case 'itemName':
                const { name } = await inquirer.prompt([
                    { type: 'input', name: 'name', message: 'Enter new menu item name:' },
                ]);
                updatedItem = { name }
                break;
            case 'description':
                const { description } = await inquirer.prompt([
                    { type: 'input', name: 'description', message: 'Enter new menu item description:' },
                ]);
                updatedItem = { description }
                break;
            case 'category':
                const { category } = await inquirer.prompt([
                    { type: 'list', name: 'category', message: 'Select new menu item category:', choices: ['breakfast', 'lunch', 'dinner', 'beverage'] },
                ]);
                updatedItem = { category }
                break;
            case 'price':
                const { price } = await inquirer.prompt([
                    { type: 'input', name: 'price', message: 'Enter new menu item price:' },
                ]);
                updatedItem = { price }
                break;
            case 'availability_status':

                const { availability_status } = await inquirer.prompt([
                    { type: 'list', name: 'availability_status', message: 'Select new availability status:', choices: ['available', 'unavailable'] },
                ]);
                updatedItem = { availability_status }
                break;
            default:
                console.log('Invalid choice.');
        }

        try {
            const menuItem = await menuItemService.updateMenuItem(+id, updatedItem);
            console.log('Menu item updated successfully');
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

export default AdminCommands.getInstance();