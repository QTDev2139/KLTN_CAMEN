export interface CreateCoupon {
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: string;
  max_discount_amount: string;
  min_order_amount: string;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  state: 'pending' | 'approved' | 'rejected' ;
  note?: string;
  is_active: boolean;
}
export interface Coupon extends CreateCoupon {
  id: number;
  user: {
    name: string;
  };
  reason_end?: string;
}