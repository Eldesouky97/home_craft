import { useAuth } from '../context/AuthContext';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  } = useAuth();

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };
};

export default useAuth;