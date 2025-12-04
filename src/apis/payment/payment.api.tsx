import { axiosApi } from '~/common/until/request.until';
import { Payment, Refund } from './payment.interface.api';

export const createPayment = async (
  data: Payment,
): Promise<{
  [x: string]: any;
  payment_url: string;
}> => {
  const res = await axiosApi.post('/payment/vnpay', data);
  return res.data;
};

export const getStatus = async (orderId: string) => {
  const res = await axiosApi.get(`/payment/vnpay/status/${orderId}`);
  return res.data;
};

export const vnpayAutoRefund = async (data: Partial<Refund>): Promise<any> => {
  const res = await axiosApi.post('/payment/vnpay_auto_refund', data);
  return res.data;
};

export const vnpayManualRefund = async (data: Refund): Promise<any> => {
  const res = await axiosApi.post('/payment/vnpay_manual_refund', data);
  return res.data;
};
