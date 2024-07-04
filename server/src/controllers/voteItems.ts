import { Socket } from 'socket.io';
import VoteItemService from '../services/voteItem';

class VoteItemController {
    private voteItemService: VoteItemService;

    constructor() {
        this.voteItemService = new VoteItemService();
    }

    public createVoteItem = async (socket: Socket, data: any): Promise<void> => {
        const { menu_id, date } = data;
        try {
            const voteItem = await this.voteItemService.createVoteItem(menu_id, date);
            socket.emit('createVoteItemSuccess', voteItem);
        } catch (error) {
            socket.emit('createVoteItemError', { error: error.message });
        }
    };

    public getVoteItems = async (socket: Socket, data: any): Promise<void> => {
        const { date } = data;
        try {
            const voteItems = await this.voteItemService.getVoteItemsByDate(date);
            socket.emit('getVoteItemsSuccess', voteItems);
        } catch (error) {
            socket.emit('getVoteItemsError', { error: error.message });
        }
    };

    public getVoteItemById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const voteItem = await this.voteItemService.getVoteItemById(+id);
            socket.emit('getVoteItemByIdSuccess', voteItem);
        } catch (error) {
            socket.emit('getVoteItemByIdError', { error: error.message });
        }
    };

    public updateVoteItem = async (socket: Socket, data: any): Promise<void> => {
        const id = data.id;
        const { menu_id, date, votes } = data.voteItem;

        try {
            const voteItem = await this.voteItemService.updateVoteItem(+id, { menu_id, date, votes });
            socket.emit('updateVoteItemSuccess', voteItem);
        } catch (error) {
            socket.emit('updateVoteItemError', { error: error.message });
        }
    };

    public deleteVoteItem = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.voteItemService.deleteVoteItem(+id);
            socket.emit('deleteVoteItemSuccess');
        } catch (error) {
            socket.emit('deleteVoteItemError', { error: error.message });
        }
    };

    public vote = async (socket: Socket, data: any): Promise<void> => {
        console.log('vote event', data)
        const  menu_id = data.menu_item.id;
        const date = new Date().toISOString().split('T')[0];

        try {
            const voteItem = await this.voteItemService.vote(menu_id, date);
            socket.emit('voteSuccess', voteItem);
        } catch (error) {
            socket.emit('voteError', { error: error.message });
        }
    };
}

export default VoteItemController;
