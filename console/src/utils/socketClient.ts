import { io, Socket } from 'socket.io-client';

class SocketClient {
    private socket: Socket | null = null;

    constructor(private serverUrl: string) {}

    public connect(): void {
        this.socket = io(this.serverUrl);

        this.socket.on('connect', () => {
            console.log(`Connected to server at ${this.serverUrl}`);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        this.socket.on('error', (error: string) => {
            console.error(`Socket error: ${error}`);
        });
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    public emit(event: string, data?: any): void {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }
}

export default SocketClient;
