import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout } from '../../../apis/auth/service';
import { token } from '../../../apis/auth/axios';

type Ctx = {
  user: any | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<Ctx | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Khôi phục phiên sau F5
    (async () => {
      try {
        if (token.getA()) setUser(await getProfile());
      } catch {
        token.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const t = await apiLogin({ email, password });
    token.set(t);
    setUser(await getProfile());
  };
  const logout = async () => {
    try {
      await apiLogout();
    } catch {}
    token.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const v = useContext(AuthContext);
  if (!v) throw new Error('useAuth inside provider');
  return v;
};
