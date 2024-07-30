import inquirer from 'inquirer';
import ChefCommands from './commands/chef.js';
import AdminCommands from './commands/admin.js';
import EmployeeCommands from './commands/employee.js';
import AuthService from './services/auth.js';
import { UserType } from './types/user.js';
import { io } from 'socket.io-client';

const IO = io('http://localhost:8080');

const authService = new AuthService(IO);

IO.on('connect', () => {
    console.log('Connected to server');
    main();
})


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
                { name: 'Exit', value: 'exit' },

            ],
        },
    ]);

    if (userType === 'exit') process.exit(0);

    const { employeeId, password } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter your employee ID:',
        },
        {
            type: 'input',
            name: 'password',
            message: 'Enter your username:',
        },
    ]);

    try {
        const user = await authService.login(employeeId, password);

        if (user.role != userType) {
            console.log('Invalid Credentials')
            return;
        }

        if (user) {
            console.log(`Welcome, ${user.name}!`);
            switch (userType) {
                case UserType.ADMIN:
                    await AdminCommands.displayMenu(IO);
                    break;
                case UserType.CHEF:
                    await ChefCommands.displayMenu(IO);
                    break;
                case UserType.EMPLOYEE:
                    await EmployeeCommands.displayMenu(IO, user);
                    break;
                default:
                    console.log('Invalid user type.');
            }
        } else {
            console.log('Login failed. Please check your credentials.');
            process.exit(1);
        }
    } catch (error: any) {
        console.error('Error logging in:', error.message);
        process.exit(1);
    }
}
