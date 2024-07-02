import inquirer from 'inquirer';
import { isValidDateFormat } from '../utils/date.js';
import { Socket } from 'socket.io-client';
import RecommendationService from '../services/recommendation.js';

const recommendationService = new RecommendationService();

class ChefCommands {

    displayMenu = async (io: Socket) => {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose an action:',
                choices: [
                    'Propose Daily Menu',
                    'Generate Monthly Feedback Report',
                    'View Feedback',
                    'Exit'
                ]
            }
        ]);

        switch (command) {
            case 'Propose Daily Menu':
                await this.proposeDailyMenu(io);
                break;
            case 'Generate Monthly Feedback Report':
                await this.generateMonthlyReport(io);
                break;
            case 'View Feedback':
                await this.viewFeedback(io);
                break;
            case 'Exit': return;

            default:
                console.log('Invalid command');
                break;
        }
    };

    private async proposeDailyMenu(io: Socket) {
        const menu_type = await this.promptMenuType();
        const menu_date = new Date();
        const newDate = menu_date.toISOString().split('T')[0];

        const alreadyExists = await this.checkExistingRollout(io, newDate, menu_type);
        if (!alreadyExists.create && !alreadyExists.modify) return;

        const selectedItems = await this.promptMenuItems(io, menu_type);
        
        if(alreadyExists.create){
            console.log('Creating daily rollout...');
            io.emit('createDailyRollout', { date: newDate, menu_type });
        } else if(alreadyExists.modify){
            console.log('Modifying daily rollout...');
            io.emit('updateDailyRollout', { date: newDate, menu_type });
        }

        io.on('createDailyRolloutSuccess', (response) => {
            io.emit('createNotification', { notification_type: `new_${menu_type}_menu`, notification_data: selectedItems, notification_timestamp: newDate });
            console.log('Daily menu rolled out successfully:', response);
        });

        io.on('updateDailyRolloutSuccess', (response) => {
            io.emit('createNotification', { notification_type: `new_${menu_type}_menu`, notification_data: selectedItems, notification_timestamp: newDate });
            console.log('Daily menu updated successfully:', response);
        });

        io.on('createNotificationSuccess', (response) => {
            console.log('Notification sent successfully:', response);
        });

        io.on('createNotificationError', (response) => {
            console.log('Error while sending notification:', response);
        });
    }

    private async checkExistingRollout(io: Socket, date: string, menu_type: string): Promise<{ create: boolean, modify: boolean }>{
        return new Promise((resolve, reject) => {
            io.emit('getDailyRolloutByDate', { date });

            io.on('getDailyRolloutByDateSuccess', (response) => {
                if (!response) {
                    resolve({create: true, modify: false});
                } else {
                    if ((response.breakfast && menu_type === 'breakfast') ||
                        (response.lunch && menu_type === 'lunch') ||
                        (response.dinner && menu_type === 'dinner')) {
                        console.log(`${menu_type.charAt(0).toUpperCase() + menu_type.slice(1)} already rolled out for ${date}`);
                        resolve({create: false, modify: false});
                    } else {
                        resolve({create: false, modify: true});
                    }
                }
            });

            io.on('getDailyRolloutByDateError', (error) => {
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

    

    private generateMonthlyReport = async (io: Socket) => {
        const { month, year, chef_id } = await inquirer.prompt([
            {
                type: 'input',
                name: 'month',
                message: 'Enter the month (MM):',
                validate: (input) => /^\d{2}$/.test(input) && Number(input) >= 1 && Number(input) <= 12
            },
            {
                type: 'input',
                name: 'year',
                message: 'Enter the year (YYYY):',
                validate: (input) => /^\d{4}$/.test(input) && Number(input) > 2000
            },
            {
                type: 'input',
                name: 'chef_id',
                message: 'Enter your chef ID:'
            }
        ]);

        io.emit('generateMonthlyReport', { month, year, chef_id });
        io.on('generateMonthlyReportResponse', (response) => {
            console.log('Monthly feedback report:', response);
        });
    };

    private viewFeedback = (io: Socket) => {
        io.emit('viewFeedback');
        io.on('viewFeedbackResponse', (response) => {
            console.log('Feedback:', response);
        });
    };
}

export default ChefCommands;
