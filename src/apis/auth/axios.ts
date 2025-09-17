import { axiosApi } from '~/common/until/request.until';

// --- Token storage (đơn giản): you can swap to cookies if muốn ---
const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const tokenStore = {
  getAccess: () => localStorage.getItem(TOKEN_KEY),
  setAccess: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  removeAccess: () => localStorage.removeItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (t: string) => localStorage.setItem(REFRESH_KEY, t),
  removeRefresh: () => localStorage.removeItem(REFRESH_KEY),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// Attach access token cho mọi request
axiosApi.interceptors.request.use((config) => {
  const at = tokenStore.getAccess();
  if (at) config.headers.Authorization = `Bearer ${at}`;
  return config;
});

// Tự refresh khi 401

let isRefreshing = false;
let pending: Array<(t: string) => void> = [];

axiosApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // nếu 401 và chưa thử refresh
    if (error?.response?.status === 401 && !original._retry) {
      const rt = tokenStore.getRefresh();
      if (!rt) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // đợi token mới
        return new Promise((resolve) => {
          pending.push((newToken: string) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosApi(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosApi.post('/auth/refresh', {
          refresh_token: rt,
        });
        const newAccess = data.access_token as string;
        const newRefresh = data.refresh_token as string | undefined;

        tokenStore.setAccess(newAccess);
        if (newRefresh) tokenStore.setRefresh(newRefresh);

        // chạy lại các request đang chờ
        pending.forEach((cb) => cb(newAccess));
        pending = [];
        return axiosApi(original);
      } catch (e) {
        tokenStore.clear();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
