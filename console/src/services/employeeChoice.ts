import { Socket } from "socket.io-client";
import { EmployeeChoice } from '../types/employeeChoice.js'; 

class EmployeeChoicesService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createEmployeeChoice(user_id: number, menu_id: number, item_id: number, quantity_chosen: number): Promise<EmployeeChoice> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createEmployeeChoice', { user_id, menu_id, item_id, quantity_chosen });

            this.socket.on('createEmployeeChoiceSuccess', (data: EmployeeChoice) => {
                resolve(data);
            });

            this.socket.on('createEmployeeChoiceError', (error: any) => {
                reject(new Error(error.message || 'Failed to create employee choice'));
            });
        });
    }

    public async deleteEmployeeChoice(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteEmployeeChoice', { id });

            this.socket.on('deleteEmployeeChoiceSuccess', () => {
                resolve();
            });

            this.socket.on('deleteEmployeeChoiceError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete employee choice'));
            });
        });
    }

    public async getEmployeeChoiceById(id: number): Promise<EmployeeChoice> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getEmployeeChoiceById', { id });

            this.socket.on('getEmployeeChoiceByIdSuccess', (data: EmployeeChoice) => {
                resolve(data);
            });

            this.socket.on('getEmployeeChoiceByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch employee choice'));
            });
        });
    }

    public async getEmployeeChoices(): Promise<EmployeeChoice[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getEmployeeChoices');

            this.socket.on('getEmployeeChoicesSuccess', (data: EmployeeChoice[]) => {
                resolve(data);
            });

            this.socket.on('getEmployeeChoicesError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch employee choices'));
            });
        });
    }

    public async updateEmployeeChoice(id: number, user_id: number, menu_id: number, item_id: number, quantity_chosen: number): Promise<EmployeeChoice> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateEmployeeChoice', { id, user_id, menu_id, item_id, quantity_chosen });

            this.socket.on('updateEmployeeChoiceSuccess', (data: EmployeeChoice) => {
                resolve(data);
            });

            this.socket.on('updateEmployeeChoiceError', (error: any) => {
                reject(new Error(error.message || 'Failed to update employee choice'));
            });
        });
    }
}

export default EmployeeChoicesService;
