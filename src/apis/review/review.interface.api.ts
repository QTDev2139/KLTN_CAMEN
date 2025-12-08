import { OrderItem } from "../order/order.interface.api";
import { Product } from "../product/product.interface.api";

export interface CreateReview {
    order_item_id: number;
    rating: number;
    comment: string;
    images: File[];
}
export interface Review {
    id?: number;
    order_item_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user_name: string;
    order_item?: OrderItem; 
    images: string[];
    product?: Product;
}