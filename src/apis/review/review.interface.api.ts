export interface CreateReview {
    order_item_id: number;
    rating: number;
    comment: string;
    images: File[];
}
export interface Review extends CreateReview {
    created_at: string;
    rating: number;
}