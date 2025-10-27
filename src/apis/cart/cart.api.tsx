import { axiosApi } from "~/common/until/request.until";
import { CreateCart } from "./cart.api.interface";

export const createCart = async (data: CreateCart) => {
    const res = await axiosApi.post('cart', data);
    return res.data;
}

export const getCart = async (lang: 'vi' | 'en') => {
    const res = await axiosApi.get(`cart/${lang}`);
    return res.data.post;
}

export const updateCart = async (id: number | string, qty: number) => {
  const res = await axiosApi.put(`cart/${id}`, { qty });
  return res.data;
};

export const deleteCart = async (id: number | string) => {
  const res = await axiosApi.delete(`cart/${id}`);
  return res.data;
}