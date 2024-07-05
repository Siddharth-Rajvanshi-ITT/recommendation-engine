import inquirer from 'inquirer';
import { isValidDateFormat } from '../utils/date.js';
import { Socket } from 'socket.io-client';
import RecommendationService from '../services/recommendation.js';
import VoteItemService from '../services/voteItem.js';

const recommendationService = new RecommendationService();
class ChefCommands {

    private static instance: ChefCommands;
    private constructor() { }
    public static getInstance(): ChefCommands {
        if (!ChefCommands.instance) {
            ChefCommands.instance = new ChefCommands();
        }
        return ChefCommands.instance;
    }

    displayMenu = async (io: Socket) => {
        console.log('Welcome to the Chef Portal!');

        while (true) {
            const { command } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'command',
                    message: 'Choose an action:',
                    choices: [
                        'Propose Daily Menu',
                        'View Feedback',
                        'View top voted items',
                        'Exit'
                    ]
                }
            ]);

            switch (command) {
                case 'Propose Daily Menu':
                    await this.proposeDailyMenu(io);
                    break;
                case 'View Feedback':
                    await this.viewFeedback(io);
                    break;
                case 'View top voted items':
                    await this.viewTopVotedItems(io);
                    break;
                case 'Exit': console.log('exiting');
                    process.exit(0);
                default:
                    console.log('Invalid command');
                    break;
            }
        }
    };

    private async proposeDailyMenu(io: Socket) {
        const menu_type = await this.promptMenuType();
        const menu_date = new Date();
        const newDate = menu_date.toISOString().split('T')[0];

        const alreadyExists = await this.checkExistingRollout(io, newDate, menu_type);
        if (!alreadyExists.create && !alreadyExists.modify) return;

        const selectedItems = await this.promptMenuItems(io, menu_type);

        if (alreadyExists.create) {
            console.log('Creating daily rollout...');
            io.emit('createDailyRollout', { date: newDate, menu_type });
            await this.createRolloutListener(io, newDate, menu_type, selectedItems);
        } else if (alreadyExists.modify) {
            console.log('Modifying daily rollout...');
            io.emit('updateDailyRollout', { date: newDate, menu_type });
            await this.updateRolloutListener(io, newDate, menu_type, selectedItems);
        }
    }

    private async createRolloutListener(io: Socket, newDate: string, menu_type: string, selectedItems: number[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const successHandler = async () => {
                io.off('createDailyRolloutSuccess', successHandler);
                io.off('createDailyRolloutError', errorHandler);
                io.emit('createNotification', { notification_type: `new_${menu_type}_menu`, notification_data: selectedItems, notification_timestamp: newDate });
                console.log('Daily menu rolled out successfully');
                await this.createNotificationListener(io);
                resolve();
            };

            const errorHandler = (error: any) => {
                io.off('createDailyRolloutSuccess', successHandler);
                io.off('createDailyRolloutError', errorHandler);
                console.log('Error in rolling out daily menu:', error);
                reject(error);
            };

            io.on('createDailyRolloutSuccess', successHandler);
            io.on('createDailyRolloutError', errorHandler);
        });
    }

    private async updateRolloutListener(io: Socket, newDate: string, menu_type: string, selectedItems: number[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const successHandler = async () => {
                io.off('updateDailyRolloutSuccess', successHandler);
                io.off('updateDailyRolloutError', errorHandler);
                io.emit('createNotification', { notification_type: `new_${menu_type}_menu`, notification_data: selectedItems, notification_timestamp: newDate });
                console.log('Daily menu updated successfully');
                await this.updateNotificationListener(io);
                resolve();
            };

            const errorHandler = (error: any) => {
                io.off('updateDailyRolloutSuccess', successHandler);
                io.off('updateDailyRolloutError', errorHandler);
                console.log('Error in updating daily menu:', error);
                reject(error);
            };

            io.on('updateDailyRolloutSuccess', successHandler);
            io.on('updateDailyRolloutError', errorHandler);
        });
    }


    private async createNotificationListener(io: Socket): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const successHandler = () => {
                io.off('createNotificationSuccess', successHandler);
                io.off('createNotificationError', errorHandler);
                console.log('Notification sent successfully');
                resolve();
            };

            const errorHandler = (error: any) => {
                io.off('createNotificationSuccess', successHandler);
                io.off('createNotificationError', errorHandler);
                console.log('Error while sending notification:', error);
                reject(error);
            };

            io.on('createNotificationSuccess', successHandler);
            io.on('createNotificationError', errorHandler);
        });
    }

    private async updateNotificationListener(io: Socket): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const successHandler = () => {
                io.off('createNotificationSuccess', successHandler);
                io.off('createNotificationError', errorHandler);
                console.log('Notification sent successfully');
                resolve();
            };

            const errorHandler = (error: any) => {
                io.off('createNotificationSuccess', successHandler);
                io.off('createNotificationError', errorHandler);
                console.log('Error while sending notification:', error);
                reject(error);
            };

            io.on('createNotificationSuccess', successHandler);
            io.on('createNotificationError', errorHandler);
        });
    }


    private async checkExistingRollout(io: Socket, date: string, menu_type: string): Promise<{ create: boolean, modify: boolean }> {
        return new Promise((resolve, reject) => {
            io.emit('getDailyRolloutByDate', { date });

            io.once('getDailyRolloutByDateSuccess', (response) => {
                if (!response) {
                    resolve({ create: true, modify: false });
                } else {
                    if ((response.breakfast && menu_type === 'breakfast') ||
                        (response.lunch && menu_type === 'lunch') ||
                        (response.dinner && menu_type === 'dinner')) {
                        console.log(`${menu_type.charAt(0).toUpperCase() + menu_type.slice(1)} already rolled out for ${date}`);
                        resolve({ create: false, modify: false });
                    } else {
                        resolve({ create: false, modify: true });
                    }
                }
            });

            io.once('getDailyRolloutByDateError', (error) => {
                reject(new Error(error.message));
            });
        });
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

    private async promptMenuItems(io: Socket, menu_type: string): Promise<number[]> {
        const menuItems: any = await recommendationService.getTopRecommendations(io, menu_type);
        console.table(menuItems);

        const choices = menuItems.map((item: any) => ({
            name: `${item.name} - ₹${item.price}`,
            value: item.id
        }));

        const { selectedItems } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedItems',
                message: 'Select up to 3 items:',
                choices: choices,
                validate: function (answer) {
                    if (answer.length > 3) {
                        return 'You can select up to 3 items only.';
                    }
                    if (answer.length < 1) {
                        return 'You must choose at least one item';
                    }
                    return true;
                }
            }
        ]);

        return selectedItems;
    }

    private viewFeedback = (io: Socket) => {
        io.emit('viewFeedback');
        io.on('viewFeedbackResponse', (response) => {
            console.log('Feedback:', response);
        });
    };

    public async viewTopVotedItems(io: Socket) {
        const voteItemService = new VoteItemService(io);

        const menu_type = await this.promptMenuType();
        const voteItems = await voteItemService.getVoteItems(menu_type);

        console.log('Top voted items for', menu_type, 'are:');
        console.table(voteItems);
    }
}

export default ChefCommands.getInstance();
