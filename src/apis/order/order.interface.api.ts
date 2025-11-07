export interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  qty: number;
  unit_price: string;
  subtotal: string;
}

export interface CreateOrder {
  items: OrderItem[];
  total_amount: number;
  shipping_address?: string;
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