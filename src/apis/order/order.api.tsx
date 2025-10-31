import { axiosApi } from "~/common/until/request.until";
import { CreateOrder, Order } from "./order.api.interface";

export const createOrder = async (data: CreateOrder) => {
  const res = await axiosApi.post('order', data);
  return res.data;
};

export const getOrders = async (lang: 'vi' | 'en') => {
  const res = await axiosApi.get(`order/${lang}`);
  return res.data.post;
};

export const getOrderDetail = async (id: number | string, lang: 'vi' | 'en') => {
  const res = await axiosApi.get(`order/${id}/${lang}`);
  return res.data.post;
};