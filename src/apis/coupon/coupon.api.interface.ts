export interface Coupon {
  id: number;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: string;
  min_order_amount: string;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  user: {
    name: string;
  };
}
