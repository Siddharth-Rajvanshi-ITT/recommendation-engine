import { Feedback } from "./types/feedback";

export default class RecommendationEngine {
    private feedbacks: Feedback[];
    public itemFeedbacks: Map<number, number> = new Map();
    public itemRatings: Map<number, number> = new Map();
    private itemRatingCounts: Map<number, number> = new Map();
    private itemRatingScores: Map<number, number> = new Map();

    constructor(feedbacks: Feedback[]) {
        this.feedbacks = feedbacks;
        this.analyzeFeedbacks();
        this.getAverageRatings();
    }

    private analyzeFeedbacks(): void {
        for (const feedback of this.feedbacks) {
            if (!this.itemFeedbacks.has(feedback.item_id)) {
                this.itemFeedbacks.set(feedback.item_id, 0);
            }
            if (PositiveWords.positiveWords.includes(feedback.comment)) {
                let feedbackCount = this.itemFeedbacks.get(feedback.item_id)! + 1;
                this.itemFeedbacks.set(feedback.item_id, feedbackCount);
            }
            if (NegativeWords.negativeWords.includes(feedback.comment)) {
                let feedbackCount = this.itemFeedbacks.get(feedback.item_id)! - 1;
                this.itemFeedbacks.set(feedback.item_id, feedbackCount);
            }
        }
    }

    private getAverageRatings(): void {
        for (const feedback of this.feedbacks) {
            if (!this.itemRatingScores.has(feedback.item_id)) {
                this.itemRatingScores.set(feedback.item_id, 0);
            }
            let ratingCount = this.itemRatingScores.get(feedback.item_id)! + feedback.rating;
            this.itemRatingScores.set(feedback.item_id, ratingCount);
        }
        for (const feedback of this.feedbacks) {
            if (!this.itemRatingCounts.has(feedback.item_id)) {
                this.itemRatingCounts.set(feedback.item_id, 0);
            }
            let ratingCount = this.itemRatingCounts.get(feedback.item_id)! + 1;
            this.itemRatingCounts.set(feedback.item_id, ratingCount);
        }
        for (const feedback of this.feedbacks) {
            let averageRating = this.itemRatingScores.get(feedback.item_id)! / this.itemRatingCounts.get(feedback.item_id)!;
            this.itemRatings.set(feedback.item_id, averageRating);
        }
    }
}

class PositiveWords {
    static positiveWords: string[] = [
        "Excellent", "Outstanding", "Superb", "Fantastic", "Brilliant",
        "Exceptional", "Impressive", "Marvelous", "Remarkable", "Wonderful",
        "Great", "Amazing", "Terrific", "Fabulous", "Awesome",
        "Stellar", "Extraordinary", "Magnificent", "Perfect", "Commendable"
    ];
}

class NegativeWords {
    static negativeWords: string[] = [
        "Poor", "Disappointing", "Unsatisfactory", "Inadequate", "Subpar",
        "Mediocre", "Lacking", "Unacceptable", "Deficient", "Inferior",
        "Weak", "Flawed", "Ineffective", "Insufficient", "Dismal",
        "Unimpressive", "Below standard", "Troubling", "Frustrating", "Incomplete"
    ];
}
