import { axiosApi } from "~/common/until/request.until";
import { CreateOrder, OrderDetail } from "./order.interface.api";

export const createOrder = async (data: CreateOrder) => {
  const res = await axiosApi.post('orders', data);
  return res.data;
};

export const getOrders = async (): Promise<OrderDetail[]> => {
  const res = await axiosApi.get(`orders`);
  return res.data; 
};

export const getOrderDetail = async (id: number | string): Promise<OrderDetail[]> => {
  const res = await axiosApi.get(`orders/${id}`);
  return res.data.post; 
};

export const deleteOrder = async (id: number) => {
  const res = await axiosApi.delete(`orders/${id}`);
  return res.data;
};

export const updateOrder = async (id: number, data: Partial<OrderDetail>) => {
  const res = await axiosApi.put(`orders/${id}`, data);
  return res.data;
}