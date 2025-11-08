// AuthContext (quản lý trạng thái đăng nhập)

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '~/apis/auth/auth.api';
import { tokenStore } from '~/apis/auth/axios';
import { User } from '~/apis/user/user.interfaces.api';

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthState>({} as any);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Khởi động: nếu có token -> lấy profile
  useEffect(() => {
    (async () => {
      try {
        if (tokenStore.getAccess()) {
          const me = await authApi.profile();
          setUser(me);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const me = await authApi.login({ email, password });
    setUser(me);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};
