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
  payment_method?: string;
  note?: string;
}

export interface Order extends CreateOrder {
  id: number;
  order_code: string;
  status: string;
  created_at: string;
}