export type NotificationType = 'new_menu' | 'item_added' | 'item_status_change';

export interface Notification {
    id: number;
    user_id: number;
    notification_type: NotificationType;
    notification_data: any;
    notification_timestamp: Date;
}
