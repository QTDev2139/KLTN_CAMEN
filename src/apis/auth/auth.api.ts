import { axiosApi } from '~/common/until/request.until';
import { tokenStore } from './axios';

export interface LoginPayload { email: string; password: string; }
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
}
export interface Profile { id: number; name: string; email: string; role_id: number; }

export const authApi = {
  login: async (payload: LoginPayload): Promise<Profile> => {
    const { data } = await axiosApi.post<LoginResponse>('/auth/login', payload);
    tokenStore.setAccess(data.access_token);
    tokenStore.setRefresh(data.refresh_token);
    const me = await authApi.profile();
    return me;
  },

  profile: async (): Promise<Profile> => {
    const { data } = await axiosApi.get<Profile>('/auth/profile');
    return data;
  },

  logout: async (): Promise<void> => {
    try { await axiosApi.post('/auth/logout'); } finally { tokenStore.clear(); }
  }
};
