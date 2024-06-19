import inquirer from 'inquirer';
import ChefCommands from './commands/chef.js';
import AdminCommands from './commands/admin.js';
import EmployeeCommands from './commands/employee.js';
import AuthService from './services/auth.js';
import { UserType } from './types/user.js';
import { io } from 'socket.io-client';

const IO = io('http://localhost:8080');

const authService = new AuthService(IO);
const employeeCommands = new EmployeeCommands();
const chefCommands = new ChefCommands();
const adminCommands = new AdminCommands();


async function main() {
    console.log("Welcome to the Food Recommendation System!");

    const { userType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'userType',
            message: 'Please select your role:',
            choices: [
                { name: 'Admin', value: UserType.ADMIN },
                { name: 'Chef', value: UserType.CHEF },
                { name: 'Employee', value: UserType.EMPLOYEE },
            ],
        },
    ]);

    const { employeeId, name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter your employee ID:',
        },
        {
            type: 'input',
            name: 'name',
            message: 'Enter your name:',
        },
    ]);

    try {
        const user = await authService.login(employeeId, name);

        if (user) {
            console.log(`Welcome, ${user.name}!`);
            switch (userType) {
                case UserType.ADMIN:
                    await adminCommands.displayMenu(IO);
                    break;
                case UserType.CHEF:
                    await chefCommands.displayMenu(IO);
                    break;
                case UserType.EMPLOYEE:
                    await employeeCommands.displayMenu(IO, user);
                    break;
                default:
                    console.log('Invalid user type.');
            }

            main()

        } else {
            console.log('Login failed. Please check your credentials.');
        }
    } catch (error: any) {
        console.error('Error logging in:', error.message);
    }
}

main();
