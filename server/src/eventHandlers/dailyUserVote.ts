import { Socket } from 'socket.io';
import DailyUserVoteSocketHandler from '../controllers/dailyUserVote';


export default class DailyUserVoteEventHandler {
    private socket: Socket;
    protected dailyUserVoteSocketHandler: DailyUserVoteSocketHandler;

    constructor(socket: Socket) {
        this.socket = socket;
        this.dailyUserVoteSocketHandler = new DailyUserVoteSocketHandler();
    }

    listen() {
        this.socket.on('createUserVote', async (data) => {
            await this.dailyUserVoteSocketHandler.createUserVote(this.socket, data);
        });
        this.socket.on('getUserVotes', async () => {
            await this.dailyUserVoteSocketHandler.getUserVotes(this.socket);
        });
        this.socket.on('getUserVoteById', async (data) => {
            await this.dailyUserVoteSocketHandler.getUserVoteById(this.socket, data);
        });
        this.socket.on('getUserVotesByCondition', async (data) => {
            await this.dailyUserVoteSocketHandler.getUserVotesByCondition(this.socket, data);
        });
        this.socket.on('updateUserVote', async (data) => {
            await this.dailyUserVoteSocketHandler.updateUserVote(this.socket, data);
        });
        this.socket.on('deleteUserVote', async (data) => {
            await this.dailyUserVoteSocketHandler.deleteUserVote(this.socket, data);
        });
    }
}
