import { axiosApi } from "~/common/until/request.until";
import { PostCategory } from "./post-category.interface.api";

export const getPostCategory = async (lang: 'vi' | 'en'): Promise<PostCategory[]> => {
    const res = await axiosApi.get(`post-categories/${lang}`);
    return res.data;
}

export const createPostCategory = async (data: Partial<PostCategory>): Promise<PostCategory> => {
    const res = await axiosApi.post(`post-categories`, data);
    return res.data;
}

export const updatePostCategory = async (id: number, data: Partial<PostCategory>): Promise<PostCategory> => {
    const res = await axiosApi.put(`post-categories/${id}`, data);
    return res.data;
}

export const deletePostCategory = async (id: number): Promise<void> => {
    await axiosApi.delete(`post-categories/${id}`);
}