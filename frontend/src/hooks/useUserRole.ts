import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiClient.get<{ roles: AppRole[] }>('/api/roles');
        setRoles(data.roles || []);
      } catch (err) {
        console.error('Error fetching user roles:', err);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator') || isAdmin;

  return {
    roles,
    isLoading,
    hasRole,
    isAdmin,
    isModerator,
  };
};
