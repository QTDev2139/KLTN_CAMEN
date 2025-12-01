import { axiosApi } from "~/common/until/request.until";
import { DeliveryDetail, RequestImportPayload, ShortageResponse } from "./request-import.interface.api";

export const getImportRequests = async (): Promise<RequestImportPayload[]> => {
    const res = await axiosApi.get<RequestImportPayload[]>('/request-imports');
    return res.data;
}

export const createImportRequestPayload = async (data: RequestImportPayload): Promise<RequestImportPayload> => {
    const res = await axiosApi.post<RequestImportPayload>('/request-imports', data);
    return res.data;
};

export const updateImportRequest = async (id: number, data: RequestImportPayload): Promise<RequestImportPayload> => {
    const res = await axiosApi.put<RequestImportPayload>(`/request-imports/${id}`, data);
    return res.data;
}

export const updateStatusImportRequest = async (id: number, status: string) => {
    const res = await axiosApi.put<RequestImportPayload>(`/request-imports/status/${id}`, { status });
    return res.data;
}

export const deleteImportRequest = async (id: number): Promise<void> => {
    await axiosApi.delete(`/request-imports/${id}`);
}

// missed
export const getImportRequestDetail = async (id: number): Promise<ShortageResponse> => {
    const res = await axiosApi.get<ShortageResponse>(`/request-imports/${id}`);
    return res.data;
}

// Delivery APIs

export const getDeliveryDetail = async (id: number): Promise<DeliveryDetail[]> => {
    const res = await axiosApi.get<DeliveryDetail[]>(`/deliveries/${id}`);
    return res.data;
}

export const createDelivery = async (id: number, data: DeliveryDetail): Promise<DeliveryDetail> => {
    const res = await axiosApi.post<DeliveryDetail>('/deliveries', data);
    return res.data;
};

export const updateDelivery = async (id: number, data: DeliveryDetail): Promise<DeliveryDetail> => {
    const res = await axiosApi.put<DeliveryDetail>(`/deliveries/${id}`, data);
    return res.data;
}

export const updateMissedDelivery = async (id: number, data: DeliveryDetail): Promise<DeliveryDetail> => {
    const res = await axiosApi.put<DeliveryDetail>(`/deliveries/missed/${id}`, data);
    return res.data;
}


