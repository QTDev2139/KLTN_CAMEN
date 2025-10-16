import axios from "axios";

export const axiosApi = axios.create({
  baseURL: 'http://192.168.1.103:8000/api/',
});

