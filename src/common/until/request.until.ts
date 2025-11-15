import axios from "axios";

export const axiosApi = axios.create({
  // baseURL: 'https://vlssoft.id.vn/kltn-be/public/api/',
  baseURL: 'http://localhost:8000/api/',
});

