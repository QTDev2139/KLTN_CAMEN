import { axiosApi } from "~/common/until/request.until"
import { Contact } from "./contact.interface.api"


export const createContact = async (data: Contact) => { 
    const response = await axiosApi.post('contact', data);
    return response;
}

export const listContacts = async () => { 
    const response = await axiosApi.get('contact');
    return response.data;
}

export const updateSupportContact = async (id: number | string, user_id: number) => { 
    const response = await axiosApi.put(`contact/${id}`, { user_id });
    return response.data;
}

export const updateStatusContact = async (id: number | string, note: string) => { 
    const response = await axiosApi.put(`contact/status/${id}`, { note });
    return response.data;
}

export const deleteContact = async (id: number | string) => { 
    const response = await axiosApi.delete(`contact/${id}`);
    return response.data;
}