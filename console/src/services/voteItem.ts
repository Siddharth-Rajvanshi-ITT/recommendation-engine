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

    public async getVoteItems(category: string): Promise<VoteItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getVoteItems', { category });

            this.socket.on('getVoteItemsSuccess', (data: VoteItem[]) => {
                resolve(data);
            });

            this.socket.on('getVoteItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch vote items'));
            });
        });
    }

    public async getVoteItemsByDate(category: string, date: string): Promise<VoteItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getVoteItemsByDate', { category, date });

            this.socket.on('getVoteItemsByDateSuccess', (data: VoteItem[]) => {
                resolve(data);
            });

            this.socket.on('getVoteItemsByDateError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch vote items'));
            });
        });
    }

    public async isAlreadyVoted(category: string, user: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getUserVotesByCondition', { category, user });

            this.socket.on('getUserVotesByConditionSuccess', (data: boolean) => {
                resolve(data);
            });

            this.socket.on('getUserVotesByConditionError', (error: any) => {
                reject(new Error(error.message || 'Failed to check if already voted'));
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

    public async vote(menu_item: number, user: any): Promise<VoteItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createUserVote', { menu_item, user });

            this.socket.on('createUserVoteSuccess', (data: VoteItem) => {
                this.socket.emit
                resolve(data);
            });

            this.socket.on('createUserVoteError', (error: any) => {
                reject(new Error(error.message || 'Failed to vote'));
            });
        });
    }
}

export default VoteItemService;
