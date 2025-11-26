declare module 'react-google-recaptcha' {
  import * as React from 'react';

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    size?: 'compact' | 'invisible' | 'normal';
    theme?: 'light' | 'dark';
    tabindex?: number;
    hl?: string;
    badge?: 'bottomright' | 'bottomleft' | 'inline';
  }

  // export default as a class so it can be used as value and instance type
  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    getValue(): string | null;
    execute(): Promise<string> | void;
  }
}