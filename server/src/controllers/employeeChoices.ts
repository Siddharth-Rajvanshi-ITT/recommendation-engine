import { Socket } from 'socket.io';
import EmployeeChoicesService from '../services/employeeChoices';

class EmployeeChoicesController {
    private employeeChoicesService: EmployeeChoicesService;

    constructor() {
        this.employeeChoicesService = new EmployeeChoicesService();
    }

    public createEmployeeChoice = async (socket: Socket, data: any): Promise<void> => {
        const { user_id, menu_id, item_id, quantity_chosen } = data;
        try {
            const employeeChoice = await this.employeeChoicesService.createEmployeeChoice(user_id, menu_id, item_id, quantity_chosen);
            socket.emit('createEmployeeChoiceSuccess', employeeChoice);
        } catch (error) {
            socket.emit('createEmployeeChoiceError', { error: error.message });
        }
    };

    public getEmployeeChoices = async (socket: Socket): Promise<void> => {
        try {
            const employeeChoices = await this.employeeChoicesService.getEmployeeChoices();
            socket.emit('getEmployeeChoicesSuccess', employeeChoices);
        } catch (error) {
            socket.emit('getEmployeeChoicesError', { error: error.message });
        }
    };

    public getEmployeeChoiceById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const employeeChoice = await this.employeeChoicesService.getEmployeeChoiceById(+id);
            socket.emit('getEmployeeChoiceByIdSuccess', employeeChoice);
        } catch (error) {
            socket.emit('getEmployeeChoiceByIdError', { error: error.message });
        }
    };

    public updateEmployeeChoice = async (socket: Socket, data: any): Promise<void> => {
        const { id, user_id, menu_id, item_id, quantity_chosen } = data;
        try {
            const employeeChoice = await this.employeeChoicesService.updateEmployeeChoice(+id, user_id, menu_id, item_id, quantity_chosen);
            socket.emit('updateEmployeeChoiceSuccess', employeeChoice);
        } catch (error) {
            socket.emit('updateEmployeeChoiceError', { error: error.message });
        }
    };

    public deleteEmployeeChoice = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.employeeChoicesService.deleteEmployeeChoice(+id);
            socket.emit('deleteEmployeeChoiceSuccess');
        } catch (error) {
            socket.emit('deleteEmployeeChoiceError', { error: error.message });
        }
    };
}

export default EmployeeChoicesController;
