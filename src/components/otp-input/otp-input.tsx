import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

// OtpInputComponent.tsx
interface OtpInputComponentProps {
  otp: string;
  setOtp: (value: string) => void;
}

export default function OtpInputComponent({ otp, setOtp }: OtpInputComponentProps) {
  return (
    <OtpInput
      value={otp}
      onChange={(value) => setOtp(value)} 
      numInputs={6}
      inputType="tel"
      inputStyle={{
        border: '1px solid #333',
        borderRadius: '8px',
        width: '34px',
        height: '34px',
        fontSize: '14px',
        color: '#000',
        fontWeight: '400',
        caretColor: 'blue',
        margin: '0 4px',
      }}
      renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
    />
  );
}
