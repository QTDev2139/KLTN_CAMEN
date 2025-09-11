import { axiosApi } from "~/common/until/request.until";

export const getListBlog = async () => {
    try {
        const res = await axiosApi.get('posts');
        return res.data;
    } catch(error) {
        console.log(error);
    }
}