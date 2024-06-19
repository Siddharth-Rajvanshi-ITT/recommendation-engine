import inquirer from 'inquirer';
import { isValidDateFormat } from '../utils/date.js';
import { Socket } from 'socket.io-client';

class ChefCommands {

    displayMenu = async (io:Socket) => {
        const choices = [
            'Propose Daily Menu',
            'Generate Monthly Feedback Report',
            'View Feedback',
            'Exit'
        ];

        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose an action:',
                choices
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

        await this.displayMenu(io);
    };

    proposeDailyMenu = async (io:Socket) => {
        const { menu_date, menu_type, chef_id } = await inquirer.prompt([
            {
                type: 'input',
                name: 'menu_date',
                message: 'Enter menu date (DD-MM-YYYY):',
                validate: (input) => isValidDateFormat(input)
            },
            {
                type: 'list',
                name: 'menu_type',
                message: 'Select menu type:',
                choices: ['breakfast', 'lunch', 'dinner']
            },
            {
                type: 'input',
                name: 'chef_id',
                message: 'Enter your chef ID:'
            }
        ]);

        io.emit('proposeDailyMenu', { menu_date, menu_type, chef_id });
        io.on('proposeDailyMenuResponse', (response) => {
            console.log('Daily menu proposed successfully:', response);
        });
    };

    generateMonthlyReport = async (io:Socket) => {
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

    viewFeedback = (io:Socket) => {
        io.emit('viewFeedback');
        io.on('viewFeedbackResponse', (response) => {
            console.log('Feedback:', response);
        });
    };
}

export default ChefCommands;
