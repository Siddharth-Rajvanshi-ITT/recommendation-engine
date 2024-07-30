import { Socket } from 'socket.io';
import EmployeePreferencesController from '../controllers/employeePreferences';

export default class EmployeePreferencesEventHandler {
    private socket: Socket;
    private employeePreferencesController: EmployeePreferencesController;

    constructor(socket: Socket) {
        this.socket = socket;
        this.employeePreferencesController = new EmployeePreferencesController();
    }

    listen() {
        this.socket.on('createEmployeePreference', async (data) => {
            await this.employeePreferencesController.createEmployeePreference(this.socket, data);
        });
        this.socket.on('getEmployeePreferences', async () => {
            await this.employeePreferencesController.getAllEmployeePreferences(this.socket);
        });
        this.socket.on('getEmployeePreference', async (data) => {
            await this.employeePreferencesController.getEmployeePreference(this.socket, data);
        });
        this.socket.on('updateEmployeePreference', async (data) => {
            await this.employeePreferencesController.updateEmployeePreference(this.socket, data);
        });
        this.socket.on('deleteEmployeePreference', async (data) => {
            await this.employeePreferencesController.deleteEmployeePreference(this.socket, data);
        });
    }
}
