import { useCallback, useEffect, useState } from 'react';
import { userApi } from '~/apis';
import { User } from '~/apis/user/user.interfaces.api';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getProfile();
      setProfile(res);
      setError(null);
    } catch (err) {
      console.error('useProfile fetch error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
};