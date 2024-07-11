import inquirer from 'inquirer';
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
                        'View top voted items',
                        'View discardable items',
                        'Submit Daily Menu',
                        'Exit'
                    ]
                }
            ]);

            switch (command) {
                case 'Propose Daily Menu':
                    await this.proposeDailyMenu(io);
                    break;
                case 'View top voted items':
                    await this.viewTopVotedItems(io);
                    break;
                case 'Submit Daily Menu':
                    await this.submitDailyMenu(io);
                    break;
                case 'View discardable items':
                    await this.viewDiscardableItems(io);
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
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const menu_date = tomorrow.toISOString().split('T')[0];

        const alreadyExists = await this.checkExistingRollout(io, menu_date, menu_type);
        if (!alreadyExists.create && !alreadyExists.modify) return;

        const selectedItems = await this.promptMenuItems(io, menu_type);

        if (alreadyExists.create) {
            console.log('Creating daily rollout...');
            io.emit('createDailyRollout', { date: menu_date, menu_type });
            await this.createRolloutListener(io, menu_date, menu_type, selectedItems);
        } else if (alreadyExists.modify) {
            console.log('Modifying daily rollout...');
            io.emit('updateDailyRollout', { date: menu_date, menu_type });
            await this.updateRolloutListener(io, menu_date, menu_type, selectedItems);
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

    public async viewTopVotedItems(io: Socket) {
        const voteItemService = new VoteItemService(io);

        const menu_type = await this.promptMenuType();
        const voteItems = await voteItemService.getVoteItems(menu_type);

        if (!voteItems.length) {
            console.log("No one has voted yet.")
            return;
        }

        console.log('Top voted items for', menu_type, 'are:');
        console.table(voteItems);

        return voteItems;
    }

    public async submitDailyMenu(io: Socket) {
        const voteItemService = new VoteItemService(io);

        const menu_type = await this.promptMenuType();
        const menu_date = new Date().toISOString().split('T')[0];

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const vote_date = yesterday.toISOString().split('T')[0];

        const alreadyExists = await this.checkExistingDailyMenu(io, menu_date, menu_type);
        if (!alreadyExists.create && !alreadyExists.modify) return;

        const topVotedItems = await voteItemService.getVoteItemsByDate(menu_type, vote_date);

        if (!topVotedItems.length) {
            console.log("No one has voted yet, please wait!");
            return;
        }

        console.table(topVotedItems)

        const dailyMenuItem = await this.promptDailyMenu(topVotedItems);

        if (alreadyExists.create) {
            console.log('Creating daily item submission...');
            io.emit('createDailyItemSubmission', { date: menu_date, menu_type });
            await this.createItemSubmissionListener(io, dailyMenuItem.item_id, +dailyMenuItem.quantity);
        } else if (alreadyExists.modify) {
            console.log('Modifying daily item submission...');
            io.emit('updateDailyItemSubmission', { date: menu_date, menu_type });
            await this.updateItemSubmissionListener(io, dailyMenuItem.item_id, +dailyMenuItem.quantity);
        }
    }

    private async createItemSubmissionListener(io: Socket, item_id: number, quantity: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const successHandler = async () => {
                io.off('createDailyItemSubmissionSuccess', successHandler);
                io.off('createDailyItemSubmissionError', errorHandler);
                io.emit('createDailyMenuItem', { item_id, quantity });
                console.log('Daily item submission created successfully');
                resolve();
            };

            const errorHandler = (error: any) => {
                io.off('createDailyItemSubmissionSuccess', successHandler);
                io.off('createDailyItemSubmissionError', errorHandler);
                console.log('Error in creating daily item submission:', error);
                reject(error);
            };

            io.on('createDailyItemSubmissionSuccess', successHandler);
            io.on('createDailyItemSubmissionError', errorHandler);
        });
    }

    private async updateItemSubmissionListener(io: Socket, item_id: number, quantity: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const successHandler = async () => {
                io.off('updateDailyItemSubmissionSuccess', successHandler);
                io.off('updateDailyItemSubmissionError', errorHandler);
                io.emit('createDailyMenuItem', { item_id, quantity });
                console.log('Daily item submission updated successfully');
                resolve();
            };

            const errorHandler = (error: any) => {
                io.off('updateDailyItemSubmissionSuccess', successHandler);
                io.off('updateDailyItemSubmissionError', errorHandler);
                console.log('Error in updating daily item submission:', error);
                reject(error);
            };

            io.on('updateDailyItemSubmissionSuccess', successHandler);
            io.on('updateDailyItemSubmissionError', errorHandler);
        });
    }

    private async promptDailyMenu(topVotedItems: any) {
        const dailyMenuItem = await inquirer.prompt([
            {
                type: 'list',
                name: 'item_id',
                message: 'Select menu item you are preparing:',
                choices: topVotedItems.map((item: any) => {
                    return {
                        name: item.name,
                        value: item.id
                    }
                })
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Enter quantity prepared:',
                validate: function (value) {
                    if (isNaN(value) || value < 1) {
                        return 'Please enter a valid quantity';
                    }
                    return true;
                }
            }
        ]);

        return dailyMenuItem;
    }

    private async checkExistingDailyMenu(io: Socket, date: string, menu_type: string): Promise<{ create: boolean, modify: boolean }> {
        return new Promise((resolve, reject) => {
            io.emit('getDailyItemSubmissionByDate', { date });

            io.once('getDailyItemSubmissionByDateSuccess', (response) => {
                if (!response) {
                    resolve({ create: true, modify: false });
                } else {
                    if ((response.breakfast && menu_type === 'breakfast') ||
                        (response.lunch && menu_type === 'lunch') ||
                        (response.dinner && menu_type === 'dinner')) {
                        console.log(`${menu_type.charAt(0).toUpperCase() + menu_type.slice(1)} already submitted for ${date}`);
                        resolve({ create: false, modify: false });
                    } else {
                        resolve({ create: false, modify: true });
                    }
                }
            });

            io.once('getDailyItemSubmissionByDateError', (error) => {
                reject(new Error(error.message));
            });
        });
    }

    private async viewDiscardableItems(io: Socket) {
        const menu_type = await this.promptMenuType();

        const choice = await this.promptDiscardChoice(io, menu_type);

        if (choice === 'Exit') {
            return;
        }

        const selectedItem = await this.promptDiscardItems(io, menu_type);

        if (!selectedItem) {
            console.log('No discardable items found');
            return;
        }

        if (choice === 'Discard Item') {
            console.log('Discarding items...', selectedItem);
            io.emit('discardItem', { items: selectedItem });
        } else if (choice === 'Ask employees for feedback') {
            io.emit('canCreateDiscardRollOut');
            await this.discardRollout(io, selectedItem);
        }

    }

    private async discardRollout(io: Socket, selectedItem: any) {
        return new Promise<void>((resolve, reject) => {
            io.off('canCreateDiscardRollOutSuccess')


            io.on('canCreateDiscardRollOutSuccess', async (canCreateDiscardRollOut) => {
                if (canCreateDiscardRollOut) {
                    io.emit('createDiscardRollOut', { items: selectedItem });
                    console.log('Discard rollout created successfully');
                } else {
                    console.log('Cannot create discard rollout as it has already been created for this month');
                }
                resolve();
            })
        })
    }

    private async promptDiscardChoice(io: Socket, menu_type: string): Promise<string> {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Choose an action:',
                choices: [
                    'Discard Item',
                    'Ask employees for feedback',
                    'Exit',
                ]
            }
        ]);

        return choice;
    }

    private async promptDiscardItems(io: Socket, menu_type: string): Promise<number[] | null> {
        const menuItems: any = await recommendationService.getDiscardableItems(io, menu_type);

        if (!menuItems.length) {
            return null;
        }

        console.log('Discardable items for', menu_type, 'are:')
        console.table(menuItems);

        const selectedItems = await this.promptUserForSelection(menuItems);

        return selectedItems;
    }

    private async promptUserForSelection(menuItems: any[]): Promise<number[]> {

        const choices = menuItems.map((item: any) => ({
            name: `${item.name} - ₹${item.price}`,
            value: item
        }));


        const { selectedItems } = await inquirer.prompt([
            {
                type: 'list',
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

}

export default ChefCommands.getInstance();
