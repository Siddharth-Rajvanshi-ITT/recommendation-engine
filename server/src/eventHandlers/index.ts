import { Socket } from 'socket.io';
import AuthEventHandler from './auth';
import UserEventHandler from './user';
import DailyMenuItemEventHandler from './dailyMenuItems';
import FeedbackEventHandler from './feedback';
import MenuItemEventHandler from './menuItem';
import NotificationEventHandler from './notification';
import RecommendationEventHandler from './recommendation';
import DailyRolloutEventHandler from './dailyRollout';
import VoteItemEventHandler from './voteItem';
import DailyUserVoteEventHandler from './dailyUserVote';
import DailyItemSubmissionEventHandler from './dailyItemSubmission';
import DailyUserFeedbackEventHandler from './dailyUserFeedback';
import DiscardFeedbackEventHandler from './discardFeedback';
import DiscardRollOutEventHandler from './discardRollout';
import EmployeePreferencesEventHandler from './employeePreferences';
import MenuAttributesEventHandler from './menuAttributes';

class EventHandlers {
    private handlers: any[];

    constructor(private socket: Socket) {
        this.handlers = [
            new AuthEventHandler(socket),
            new UserEventHandler(socket),
            new DailyMenuItemEventHandler(socket),
            new FeedbackEventHandler(socket),
            new MenuItemEventHandler(socket),
            new NotificationEventHandler(socket),
            new RecommendationEventHandler(socket),
            new DailyRolloutEventHandler(socket),
            new VoteItemEventHandler(socket),
            new DailyUserVoteEventHandler(socket),
            new DailyItemSubmissionEventHandler(socket),
            new DailyUserFeedbackEventHandler(socket),
            new DiscardFeedbackEventHandler(socket),
            new DiscardRollOutEventHandler(socket),
            new EmployeePreferencesEventHandler(socket),
            new MenuAttributesEventHandler(socket),
        ];
    }

    public listen(): void {
        this.handlers.forEach((handler) => handler.listen());
    }
}

export { EventHandlers };
