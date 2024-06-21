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

    proposeDailyMenu = async (io: Socket) => {
        const { menu_type } = await inquirer.prompt([
            {
                type: 'list',
                name: 'menu_type',
                message: 'Select menu type:',
                choices: ['breakfast', 'lunch', 'dinner']
            },
        ]);

        const menuItems: any = await recommendationService.getTopRecommendations(io);

        console.table(menuItems.map((item: any) => ({ id: item.item_id, name: item.name, category: item.category, price: item.price, availability_status: item.availability_status })));

        const choices = menuItems.map((item: any) => ({
            name: `${item.name} - ${item.price}`,
            value: item.item_id
        }));

        const {selectedItems} = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedItems',
                message: 'Select up to 3 items:',
                choices: choices,
                validate: function (answer) {
                    if (answer.length > 3 ) {
                        return 'You can select up to 3 items only.';
                    }
                    if (answer.length < 1) {
                        return 'You must choose at least one item';
                    }
                    return true;
                }
            }
        ])

        const menu_date = new Date();

        const newDate = menu_date.toISOString().split('T')[0]

        console.log('Selected items:', {notification_type: 'new_menu',notification_data:selectedItems, notification_timestamp:newDate})

        io.emit('createNotification', {notification_type: 'new_menu',notification_data:selectedItems, notification_timestamp:newDate});
        io.on('createNotificationSuccess', (response) => {
            console.log('Daily menu proposed successfully:', response);
        });
    };

    generateMonthlyReport = async (io: Socket) => {
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

    viewFeedback = (io: Socket) => {
        io.emit('viewFeedback');
        io.on('viewFeedbackResponse', (response) => {
            console.log('Feedback:', response);
        });
    };
}

export default ChefCommands;
