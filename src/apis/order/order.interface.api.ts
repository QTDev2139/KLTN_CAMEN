import { CartItem } from "../cart/cart.interface.api";
import { Product } from "../product/product.interface.api";


export interface ShippingAddress {
  gender?: string;
  name: string;
  phone: string;
  email?: string;
  street: string;
  ward?: string;
  district?: string;
  province?: string;
}

export interface CreateOrder {
  items: CartItem[];
  total_amount: number;
  shipping_address?: ShippingAddress;
  payment_method?: 'cod' | 'vnpay' | 'momo';
  payment_status?: 'unpaid' | 'paid' | 'failed' | 'refunded';
  transaction_code?: string; 
  note?: string;
  coupon_code?: string;
  discount_amount?: number;
}

export interface Order extends CreateOrder {
  id: number;
  order_code: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: number;
  qty: number;
  unit_price: string;
  subtotal: string;
  order_id: number;
  product_id: number;
  product: Product;
  review?: boolean;
}

export interface OrderDetail {
  id: number;
  code: string;
  user_id: number;
  coupon: string | null;
  coupon_id: number | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  note: string | null;
  discount_total: string; // "0.00"
  subtotal: string; // "50000.00"
  grand_total: string; // "50000.00"
  status: "pending" | "processing" | "completed" | "cancelled" | string;
  payment_method: "vnpay" | "cod" | string;
  payment_status: "paid" | "unpaid" | "refunded" | string;
  transaction_code: string;
  shipping_address: ShippingAddress;
  order_items: OrderItem[];
}

