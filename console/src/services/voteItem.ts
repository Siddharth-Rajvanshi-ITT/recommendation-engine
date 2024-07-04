import { Socket } from "socket.io-client";
import { VoteItem } from '../types/voteItem.js';

class VoteItemService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createVoteItem(voteItem: VoteItem): Promise<VoteItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createVoteItem', voteItem);

            this.socket.on('createVoteItemSuccess', (data: VoteItem) => {
                resolve(data);
            });

            this.socket.on('createVoteItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to create vote item'));
            });
        });
    }

    public async getVoteItems(dateofvote: string): Promise<VoteItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getVoteItems', { dateofvote });

            this.socket.on('getVoteItemsSuccess', (data: VoteItem[]) => {
                resolve(data);
            });

            this.socket.on('getVoteItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch vote items'));
            });
        });
    }

    public async getVoteItemById(id: number): Promise<VoteItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getVoteItemById', { id });

            this.socket.on('getVoteItemByIdSuccess', (data: VoteItem) => {
                resolve(data);
            });

            this.socket.on('getVoteItemByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch vote item'));
            });
        });
    }

    public async updateVoteItem(id: number, voteItem: Partial<VoteItem>): Promise<VoteItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateVoteItem', { id, voteItem });

            this.socket.on('updateVoteItemSuccess', (data: VoteItem) => {
                resolve(data);
            });

            this.socket.on('updateVoteItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to update vote item'));
            });
        });
    }

    public async deleteVoteItem(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteVoteItem', { id });

            this.socket.on('deleteVoteItemSuccess', () => {
                resolve();
            });

            this.socket.on('deleteVoteItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete vote item'));
            });
        });
    }

    public async vote(menu_item: number): Promise<VoteItem> {

        console.log('voting in process---------------')
        return new Promise((resolve, reject) => {
            this.socket.emit('vote', { menu_item });

            this.socket.on('voteSuccess', (data: VoteItem) => {
                resolve(data);
            });

            this.socket.on('voteError', (error: any) => {
                reject(new Error(error.message || 'Failed to vote'));
            });
        });
    }
}

export default VoteItemService;
