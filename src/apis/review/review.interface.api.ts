export interface CreateReview {
    order_item_id: number;
    rating: number;
    comment: string;
    images: File[];
}
export interface Review {
    order_item_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user_name: string;
    images: string[];
}