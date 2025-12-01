import { axiosApi } from "~/common/until/request.until";
import { Coupon, CreateCoupon } from "./coupon.interface.api";

export const getCoupons = async () => {
    const res = await axiosApi.get('coupon');
    return res.data;
}

export const getCouponById = async (id: number): Promise<Coupon> => {
    const res = await axiosApi.get(`coupon/${id}`);
    return res.data;
}

export const getActiveCoupons = async () => {
    const res = await axiosApi.get('coupon/active-coupons');
    return res.data;
}

export const createCoupon = async (data: CreateCoupon): Promise<CreateCoupon> => {
    const res = await axiosApi.post('coupon', data);
    return res.data;
}

export const updateStatusCoupon = async (id: number, data: Partial<Coupon>): Promise<Coupon> => {
    const res = await axiosApi.put(`coupon/status/${id}`, data);
    return res.data;
}
export const updateActiveCoupon = async (id: number, data: Partial<Coupon>): Promise<Coupon> => {
    const res = await axiosApi.put(`coupon/active/${id}`, data);
    return res.data;
}

export const deleteCoupon = async (id: number): Promise<void> => {
    await axiosApi.delete(`coupon/${id}`);
}