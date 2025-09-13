import { axiosApi } from '~/common/until/request.until';
import { Post } from './blog.api.interface';

export const getListBlog = async () => {
  try {
    const res = await axiosApi.get('posts');
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getBlogByLangAndKey = async (lang: 'vi' | 'en', key: string): Promise<Post> => {
  const res = await axiosApi.get('post', {
    params: {
      lang,
      key,
    },
  });
  return res.data.post;
};

export const getKey = async (slug: string): Promise<string> => {
  try {
    const res = await axiosApi.get(`post/slug/${slug}`);
    return res.data.post.translation_key;
  } catch (error) {
    return '';
  }
};
