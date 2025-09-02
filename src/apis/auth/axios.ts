import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosApi } from '~/common/until/request.until';

// Lưu token (demo: localStorage). Sản xuất: cân nhắc httpOnly cookie cho refresh_token.
type Tokens = { access_token: string; refresh_token: string; token_type: 'bearer'; expires_in: number };
let access: string | null = null;
let refresh: string | null = null;
let refreshing: Promise<string> | null = null;

export const token = {
  set(t: Tokens) { access = t.access_token; refresh = t.refresh_token; localStorage.setItem('auth', JSON.stringify(t)); },
  load() { const raw = localStorage.getItem('auth'); if (raw) { const t = JSON.parse(raw) as Tokens; access = t.access_token; refresh = t.refresh_token; } },
  clear() { access = refresh = null; localStorage.removeItem('auth'); },
  getA() { return access; }, getR() { return refresh; },
};
token.load();

// const api = axios.create({ baseURL: API, timeout: 15000 });

// 1) Gắn Authorization trước khi gửi
axiosApi.interceptors.request.use((cfg) => {
  if (token.getA()) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token.getA()}`;
  }
  return cfg;
});

// Hàm refresh dùng axios “thô” để không dính interceptor (tránh lặp vô hạn)
async function doRefresh(): Promise<string> {
  if (!token.getR()) throw new Error('No refresh token');
  const res = await axios.post<Tokens>(`http://127.0.0.1:8000/api/auth/refresh`, { refresh_token: token.getR() });
  token.set(res.data);
  return res.data.access_token;
}

// 2) Nếu 401 do access_token hết hạn → refresh rồi retry request cũ
axiosApi.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = err.response?.status;
    const url = (original?.url ?? '').toString();
    const isAuth = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');

    if (status === 401 && !isAuth && original && !original._retry) {
      original._retry = true;

      if (!refreshing) refreshing = doRefresh().finally(() => (refreshing = null));
      try {
        const newAccess = await refreshing;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return axiosApi.request(original);
      } catch {
        token.clear();
        window.location.replace('/login'); // refresh fail → buộc đăng nhập lại
      }
    }

    return Promise.reject(err);
  }
);

