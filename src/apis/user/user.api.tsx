import { axiosApi } from '~/common/until/request.until';
import { CreatePersonnel, User } from './user.interfaces.api';

// ----------------------------------- REGISTER ----------------------------------
export const createRegister = async ({ name, email, password }: User) => {
  const res = await axiosApi.post('auth/register/request-otp', {
    name,
    email,
    password,
  });
  return res.data.message;
};

export const resendOtpRegister = async ({email}: {email: string} ) => {
  const res = await axiosApi.post('auth/register/request-otp', {
    email,
  });
  return res.data.message;
};

export const verifyRegister = async ({ email, otp }: { email: string; otp: string }) => {
  const res = await axiosApi.post('auth/register/verify-otp', {
    email,
    otp,
  });
  return res.data.message;
}

// ----------------------------------- FORGOTTEN PASSWORD ----------------------------------
export const requestOtpForForgottenPassword = async ({email}: {email: string} ) => {
  const res = await axiosApi.post('auth/forgotten-password/request-otp', {
    email,
  });
  return res.data.message;
};

export const resendForgottenPassword = async ({email}: {email: string} ) => {
  const res = await axiosApi.post('auth/register/request-otp', {
    email,
  });
  return res.data.message;
};

export const verifyForgottenPassword = async ({ email, otp }: { email: string; otp: string }) => {
  const res = await axiosApi.post('auth/forgotten-password/verify-otp', {
    email,
    otp,
  });
  return res.data;
}

export const resetPassword = async ({ password, reset_token }: {  password: string; reset_token: string }) => {
  const res = await axiosApi.post('auth/forgotten-password/reset-password', {
    reset_token,
    password,
  });
  return res.data.message;
}

// ----------------------------------- PROFILE ----------------------------------
export const getProfile = async () => {
  const res = await axiosApi.get('auth/profile');
  return res.data.post;
}

// ----------------------------------- NHANVIEN LIST -----------------------------
export const getPersonnelList = async () => {
  const res = await axiosApi.get('/users');
  return res.data.post;
}
export const getPersonnel = async ($id: number) => {
  const res = await axiosApi.get(`/personnel/${$id}`);
  return res.data.post;
}

export const createPersonnel = async (payload: CreatePersonnel) => {
  const res = await axiosApi.post(`/users`, payload);
  return res.data;
}

export const updatePersonnel = async ($id: number, payload: Partial<CreatePersonnel>) => {
  const res = await axiosApi.put(`/users/${$id}`, payload);
  return res.data;
}