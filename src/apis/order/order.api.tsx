import { axiosApi } from "~/common/until/request.until";
import { CreateOrder } from "./order.api.interface";

export const createOrder = async (data: CreateOrder) => {
  const res = await axiosApi.post('orders', data);
  return res.data;
};

export const getOrders = async () => {
  const res = await axiosApi.get(`orders`);
  return res.data.post;
};

export const getOrderDetail = async (id: number | string) => {
  const res = await axiosApi.get(`orders/${id}`);
  return res.data.post;
};