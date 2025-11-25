import { axiosApi } from '~/common/until/request.until';
import type { CreatePostDto, Post } from './blog.interface.api';

export const getListBlog = async (lang?: number) => {
  const res = await axiosApi.get(`posts/${lang}`);
  return res.data?.post ?? res.data?.posts ?? res.data;
};

export const getDetailBlog = async (lang: number, slug: string): Promise<Post> => {
  const res = await axiosApi.get(`posts/lang/${lang}/slug/${slug}`);
  return res.data?.post ?? res.data;
}

export const createPost = async (payload: CreatePostDto | FormData): Promise<Post> => {
  const config: any = {};
  if (payload instanceof FormData) {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await axiosApi.post('posts', payload as any, config);
  return res.data?.post ?? res.data;
};

export const updatePost = async (
  id: number,
  payload: Partial<CreatePostDto> | FormData
): Promise<Post> => {
  // If FormData -> Laravel multipart + method override
  if (payload instanceof FormData) {
    payload.append('_method', 'PUT');
    const config: any = { headers: { 'Content-Type': 'multipart/form-data' } };
    const res = await axiosApi.post(`posts/${id}`, payload as any, config);
    return res.data?.post ?? res.data;
  }

  const res = await axiosApi.put(`posts/${id}`, payload);
  return res.data?.post ?? res.data;
};

export const deletePost = async (id: number) => {
  const res = await axiosApi.delete(`posts/${id}`);
  return res.data;
};