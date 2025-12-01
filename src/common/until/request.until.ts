import axios from "axios";
import { echo } from "~/lib/echo";

export const axiosApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL as string,
});

axiosApi.interceptors.request.use(
  (config) => {
    // Gửi JWT như cũ
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // gắn X-Socket-Id để toOthers() hoạt động
    const socketId = echo.socketId();
    if (socketId) {
      config.headers = config.headers || {};
      (config.headers as any)['X-Socket-Id'] = socketId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const baseURL = axios.create({
  baseURL: process.env.REACT_APP_BASE as string,
});
