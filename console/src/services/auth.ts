import { io, Socket } from "socket.io-client";

class AuthService {
    private socket: Socket;

    constructor(io: Socket) {
        this.socket = io; 
    }

    public async login(employeeId: string, name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit('login', { employeeId, name })

            this.socket.on('authSuccess', (data) => {
                resolve(data.user);
            })
            this.socket.on('authError', (error) => {
                reject(new Error('Authentication failed. Please check your employee ID and name.'));
            })
        });
    };
}


export default AuthService;
