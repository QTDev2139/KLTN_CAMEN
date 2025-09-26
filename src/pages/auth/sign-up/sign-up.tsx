import RequestOtpSignUp from './request-otp-sign-up';
import VerifyOtpSignUp from './verify-otp-sign-up';
import { useState } from 'react';
import { SignUpMode } from './sign-up.enum';

export default function SignupPage() {
  const [mode, setMode] = useState<SignUpMode>(SignUpMode.REQUEST);
  const [email, setEmail] = useState<string>('');
  return (
    <>
      {/* <VerifyOtpSignUp /> */}
    {(mode === SignUpMode.REQUEST) && 
      <RequestOtpSignUp setMode={setMode} setEmail={setEmail}/>
    }
    {(mode === SignUpMode.VERIFY) && 
      <VerifyOtpSignUp setMode={setMode} email={email}/>
    }
    </>
  );
}
