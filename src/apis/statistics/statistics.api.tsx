import { axiosApi } from "~/common/until/request.until"

export const getStatisticsOverview = async (data: {startDate: string, endDate: string}) => { 
    const res = await axiosApi.get(`v1/statistics/overview`, { params: data });
    return res.data;
}

export const getStatisticsDashboard = async (data: {startDate: string, endDate: string}) => { 
    const res = await axiosApi.get(`v1/statistics/dashboard-data`, { params: data });
    return res.data;
}