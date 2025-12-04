import { axiosApi } from "~/common/until/request.until"

export const getAnnouncement = async() => {
    const res = await axiosApi.get("/announcements")
    return res.data;
 }