import { useEffect, useState } from 'react';
import { userApi } from '~/apis';
import { UserType } from '~/apis/user/user.enum';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await userApi.getProfile();
        setUserRole(user.role.name as UserType);
        console.log('User role fetched:', user.role.name);
      } catch (error) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const hasAccess = (allowedRoles?: UserType[]): boolean => {
    // ✅ Kiểm tra an toàn
    if (!userRole) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true; // Không giới hạn quyền
    return allowedRoles.includes(userRole);
  };

  return { userRole, loading, hasAccess };
};