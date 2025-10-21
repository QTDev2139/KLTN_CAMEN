import { axiosApi } from "~/common/until/request.until"
import { Category } from "./category.interface.api";

export const getCategory = async (lang: 'vi' | 'en'): Promise<Category[]> => {
    const res = await axiosApi.get(`category/${lang}`);
    return res.data;
}