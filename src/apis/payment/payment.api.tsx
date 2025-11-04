import { axiosApi } from '~/common/until/request.until';
import { Payment } from './payment.api.interface';

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
