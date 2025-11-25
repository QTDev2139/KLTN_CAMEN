import { axiosApi } from "~/common/until/request.until";
import { PostCategoryApi } from "./post-category.interface.api";

export const getPostCategory = async (lang: 'vi' | 'en'): Promise<PostCategoryApi[]> => {
  const res = await axiosApi.get(`post-categories/${lang}`);
  return res.data;
};

export const createPostCategory = async (data: { post_category_translations: Partial<PostCategoryApi['post_category_translations']> }): Promise<PostCategoryApi> => {
  const res = await axiosApi.post(`post-categories`, data);
  return res.data;
};

export const updatePostCategory = async (id: number, data: { post_category_translations: Partial<PostCategoryApi['post_category_translations']> }): Promise<PostCategoryApi> => {
  const res = await axiosApi.put(`post-categories/${id}`, data);
  return res.data;
};

export const deletePostCategory = async (id: number): Promise<void> => {
  await axiosApi.delete(`post-categories/${id}`);
};


