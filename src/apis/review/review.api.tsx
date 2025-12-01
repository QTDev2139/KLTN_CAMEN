import { axiosApi } from "~/common/until/request.until";

export const createReview = async (fd: FormData) => {
    const res = await axiosApi.post('review', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}

export const getReviews = async () => {
    const res = await axiosApi.get('review');
    return res.data;
}