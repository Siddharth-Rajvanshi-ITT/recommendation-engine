import { Socket } from 'socket.io';
import UserService from '../services/user';

class UserController {
    private userService: UserService;
    public createUser = async (socket: Socket, data: any): Promise<void> => {
        const { employeeID, name, email, password } = data;
        try {
            const user = await this.userService.createUser(employeeID, name, email, password);
            socket.emit('createUserSuccess', user);
        } catch (error) {
            socket.emit('createUserError', { error: error.message });
        }
    };
    public deleteUser = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.userService.deleteUser(id);
            socket.emit('deleteUserSuccess');
        } catch (error) {
            socket.emit('deleteUserError', { error: error.message });
        }
    };
    public getUserById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const user = await this.userService.getUserById(id);
            socket.emit('getUserByIdSuccess', user);
        } catch (error) {
            socket.emit('getUserByIdError', { error: error.message });
        }
    };
    public getUsers = async (socket: Socket): Promise<void> => {
        try {
            const users = await this.userService.getUsers();
            socket.emit('getUsersSuccess', users);
        } catch (error) {
            socket.emit('getUsersError', { error: error.message });
        }
    };
    public updateUser = async (socket: Socket, data: any): Promise<void> => {
        const { id, name, email, password } = data;
        try {
            const user = await this.userService.updateUser(id, name, email, password);
            socket.emit('updateUserSuccess', user);
        } catch (error) {
            socket.emit('updateUserError', { error: error.message });
        }
    };

    constructor() {
        this.userService = new UserService();
    }
}

export default UserController;
