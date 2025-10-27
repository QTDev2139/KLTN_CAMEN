import { axiosApi } from '~/common/until/request.until';
import { User } from './user.api.interfaces';

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

// --------------
export const getProfile = async () => {
  const res = await axiosApi.get('auth/profile');
  return res.data;
}