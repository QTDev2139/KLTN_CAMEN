import { axiosApi } from "~/common/until/request.until";
import { Product, ProductDetail } from "./product.interface.api";

export const getProduct = async (lang: 'vi' | 'en'): Promise<Product[]> => {
    const res = await axiosApi.get(`product/${lang}`);
    return res.data.post;
}

export const getProductByCategory = async (slug: string, lang: 'vi' | 'en'): Promise<Product[]> => {
    const res = await axiosApi.get(`product/slug/${slug}/lang/${lang}`);
    return res.data.post;
}

export const getDetailProduct = async (slug: string, lang: 'vi' | 'en'): Promise<ProductDetail> => {
    const res = await axiosApi.get(`product/${slug}/lang/${lang}`);
    return res.data.post;
}
export const getDetailProductById = async (id: number): Promise<ProductDetail> => {
    const res = await axiosApi.get(`product/id/${id}`);
    return res.data.post;
}

export const createProduct = async (fd: FormData) => {
    const res = await axiosApi.post('product', fd);
    return res.data;
}

export const updateProduct = async (id: number, fd: FormData) => {
    fd.append('_method', 'PUT'); // method override for Laravel
    const res = await axiosApi.post(`product/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}

export const deleteProduct = async (id: number) => {
    const res = await axiosApi.delete(`product/${id}`)
    return res.data
}

