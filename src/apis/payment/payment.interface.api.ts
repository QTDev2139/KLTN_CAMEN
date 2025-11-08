export interface Payment {
    amount: number;
    order_id: string;
    order_info: string;
    bank_code: string;
    return_url?: string; // ✅ Thêm return_url tùy chọn
}

// export interface createPayment {
//     payment: Payment;
//     shipping_address: string;
// }

export interface createPayment {
  code: string;                 // Mã đơn hàng
  status: string;               
  subtotal: number;             // Tổng tiền hàng
  discount_total: number;       // Tổng giảm giá
  grand_total: number;          // Tổng sau giảm giá
  payment_method: string;       // Phương thức thanh toán
  shipping_address: string;     
  note?: string;                
  user_id: number;              
  coupon_id?: number | null;    
}
