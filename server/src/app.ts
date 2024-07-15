import express, { Application } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import sequelize from './config/database';
import { EventHandlers } from './eventHandlers';

export class Server {
    private app: Application;
    private server: http.Server;
    private io: SocketIOServer;
    private eventHandlers: EventHandlers;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new SocketIOServer(this.server);
    }

    private initializeEventHandlers(socket: Socket): void {
        this.eventHandlers = new EventHandlers(socket);
        this.eventHandlers.listen();
    }

    public start(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log(`New client connected: ${socket.id}`);
            this.initializeEventHandlers(socket);

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        sequelize
            .sync()
            .then(() => {
                console.log('Database connected');
            })
            .catch((error) => {
                console.error('Database connection error:', error);
            });

        this.server.listen(8080, () => {
            console.log('Server running on port 8080');
        });
    }
}

const server = new Server();
server.start();
