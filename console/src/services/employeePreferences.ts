import { Socket } from "socket.io-client";

class EmployeePreferencesService {
    socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    async createEmployeePreference(userId: number, mealType: string, spiceLevel: string, category: string, sweetTooth: boolean) {
        return new Promise((resolve, reject) => {
            this.socket.emit('createEmployeePreference', { userId, mealType, spiceLevel, category, sweetTooth });

            this.socket.on('createEmployeePreferenceSuccess', (data: any) => {
                resolve(data);
            });

            this.socket.on('createEmployeePreferenceError', (error: any) => {
                reject(new Error(error.message || 'Failed to create employee preference'));
            });
        });
    }

    async deleteEmployeePreference(userId: number) {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteEmployeePreference', { userId });

            this.socket.on('deleteEmployeePreferenceSuccess', () => {
                resolve(null);
            });

            this.socket.on('deleteEmployeePreferenceError', (error) => {
                reject(new Error(error.message || 'Failed to delete employee preference'));
            });
        });
    }

    async getEmployeePreference(userId: number) {
        return new Promise((resolve, reject) => {
            this.socket.emit('getEmployeePreference', { userId });

            this.socket.on('getEmployeePreferenceSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getEmployeePreferenceError', (error) => {
                reject(new Error(error.message || 'Failed to fetch employee preference'));
            });
        });
    }

    async getEmployeePreferences() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getEmployeePreferences');

            this.socket.on('getEmployeePreferencesSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('getEmployeePreferencesError', (error) => {
                reject(new Error(error.message || 'Failed to fetch employee preferences'));
            });
        });
    }

    async updateEmployeePreference(userId: number, mealType: string, spiceLevel: string, category: string, sweetTooth: string) {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateEmployeePreference', { userId, mealType, spiceLevel, category, sweetTooth });

            this.socket.on('updateEmployeePreferenceSuccess', (data) => {
                resolve(data);
            });

            this.socket.on('updateEmployeePreferenceError', (error) => {
                reject(new Error(error.message || 'Failed to update employee preference'));
            });
        });
    }
}

export default EmployeePreferencesService;
