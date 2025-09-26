import RequestOtpForgottenPassword from './request-otp-fg-pw';
import VerifyOtpForgottenPassword from './verify-otp-fg-pw';
import { useState } from 'react';
import { ForgotPasswordMode } from './forgot-password.enum';
import ResetPassword from './reset-password';

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<ForgotPasswordMode>(ForgotPasswordMode.REQUEST);
  const [email, setEmail] = useState<string>('');
  return (
    <>
      {/* <VerifyOtpForgottenPassword /> */}
    {(mode === ForgotPasswordMode.REQUEST) && 
      <RequestOtpForgottenPassword setMode={setMode} setEmail={setEmail}/>
    }
    {(mode === ForgotPasswordMode.VERIFY) && 
      <VerifyOtpForgottenPassword setMode={setMode} email={email}/>
    }
    {(mode === ForgotPasswordMode.RESET) && 
      <ResetPassword />
    }
    </>
  );
}
