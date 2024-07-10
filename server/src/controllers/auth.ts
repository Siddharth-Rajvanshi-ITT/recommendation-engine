import { Socket } from 'socket.io';
import UserService from '../services/user';

class AuthController {
    private userService: UserService;
    public login = async (socket: Socket, data): Promise<void> => {
        const { employeeId, name } = data;

        console.log("Login attempt: ", employeeId, name);

        try {
            const user = await this.userService.getUserByEmployeeIdAndName(employeeId, name);
            
            if (!user) {
                socket.emit('authError', { error: 'Invalid credentials' });
                return;
            }
            
            socket.emit('authSuccess', { message: 'Login successful', user });
            console.log("Login successful")
        } catch (error) {
            socket.emit('authError', { error: error.message });
        }
    };

    constructor() {
        this.userService = new UserService();
    }
}

export default AuthController;