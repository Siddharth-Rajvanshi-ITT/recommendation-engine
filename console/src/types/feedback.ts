export interface Feedback {
    feedback_id: number;
    item_id: number;
    user_id: number;
    rating: number;
    comment: string;
    feedback_date: Date;
}