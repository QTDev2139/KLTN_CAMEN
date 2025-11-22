export interface CreateCart {
    product_id: number;
    qty: number;
}

export interface CartItem {
  id: number;
  qty: number;
  unit_price: string;
  subtotal: string;
  product_id: {
    id: number;
    quantity_per_pack: number;
  };
  product_name: string;
  product_image: string;
}

export interface Cart {
  id: number;
  user_id: number;
  is_active: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
}
