import { axiosApi } from '~/common/until/request.until';
export type LoginPayload = { email: string; password: string };
export type User = { id: number; name: string; email: string };

export async function login(data: LoginPayload) {
  const r = await axiosApi.post('/auth/login', data);
  return r.data as { access_token: string; refresh_token: string; token_type: 'bearer'; expires_in: number };
}
export async function logout() {
  return axiosApi.post('/auth/logout');
}
export async function getProfile() {
  const r = await axiosApi.get<User>('/auth/profile');
  return r.data;
}
