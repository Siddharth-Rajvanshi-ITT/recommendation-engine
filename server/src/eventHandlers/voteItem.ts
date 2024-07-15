import { Socket } from 'socket.io';
import VoteItemController from '../controllers/voteItems';

export default class VoteItemEventHandler {
    private socket: Socket;
    private voteItemController: VoteItemController;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public listen(): void {
        this.socket.on('createVoteItem', async (data) => {
            await this.voteItemController.createVoteItem(this.socket, data);
        });

        this.socket.on('getVoteItems', async (data) => {
            await this.voteItemController.getVoteItems(this.socket, data);
        });

        this.socket.on('getVoteItemsByDate', async (data) => {
            await this.voteItemController.getVoteItemsByDate(this.socket, data);
        });

        this.socket.on('getVoteItemById', async (data) => {
            await this.voteItemController.getVoteItemById(this.socket, data);
        });

        this.socket.on('updateVoteItem', async (data) => {
            await this.voteItemController.updateVoteItem(this.socket, data);
        });

        this.socket.on('deleteVoteItem', async (data) => {
            await this.voteItemController.deleteVoteItem(this.socket, data);
        });

        this.socket.on('vote', async (data) => {
            await this.voteItemController.vote(this.socket, data);
        });
    }
}
