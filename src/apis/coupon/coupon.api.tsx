import { axiosApi } from "~/common/until/request.until";
import { Coupon } from "./coupon.api.interface";

export const getCoupons = async () => {
    const res = await axiosApi.get('coupon');
    return res.data;
}

export const getActiveCoupons = async () => {
    const res = await axiosApi.get('coupon/active-coupons');
    return res.data;
}

export const createCoupon = async (data: Coupon): Promise<Coupon> => {
    const res = await axiosApi.post('coupon', data);
    return res.data;
}

export const updateCoupon = async (id: number, data: Coupon): Promise<Coupon> => {
    const res = await axiosApi.put(`coupon/${id}`, data);
    return res.data;
}

export const deleteCoupon = async (id: number): Promise<void> => {
    await axiosApi.delete(`coupon/${id}`);
}