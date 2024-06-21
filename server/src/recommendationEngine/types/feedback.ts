export interface FeedbackAttributes {
    feedback_id: number;
    item_id: number;
    user_id: number;
    rating: number;
    comment: string;
    feedback_date: Date;
}

export class Feedback implements FeedbackAttributes {
    public feedback_id!: number;
    public item_id!: number;
    public user_id!: number;
    public rating!: number;
    public comment!: string;
    public feedback_date!: Date;

    constructor(attributes: FeedbackAttributes) {
        Object.assign(this, attributes);
    }
}
