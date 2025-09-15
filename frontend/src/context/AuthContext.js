import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI as api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data && response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        // إذا كان المستخدم غير موجود، قم بتسجيل الخروج
        if (response.data.error === 'User not found') {
          logout();
        } else {
          throw new Error(response.data.error || 'Failed to fetch user information');
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      
      // إذا كان الخطأ "User not found"، قم بتسجيل الخروج
      if (error.response?.data?.error === 'User not found') {
        logout();
      } else {
        // لأخطاء أخرى، احتفظ بـ token ولكن أظهر حالة غير مصادق
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.success) {
        const { token, data: userData } = response.data;
        
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.data?.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
      
      if (error.response?.data?.error === 'User not found') {
        errorMessage = 'البريد الإلكتروني غير مسجل. يرجى إنشاء حساب جديد.';
      } else if (error.response?.data?.error === 'Invalid password') {
        errorMessage = 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data && response.data.success) {
        const { token, data: userData } = response.data;
        
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.data?.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'فشل إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
      
      if (error.response?.data?.error?.includes('email')) {
        errorMessage = 'البريد الإلكتروني موجود مسبقاً. يرجى استخدام بريد إلكتروني آخر.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      // حفظ الصفحة الحالية للعودة إليها بعد المصادقة
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('preAuthPath', currentPath);
      
      // توجيه المستخدم إلى صفحة مصادقة Google في الخلفية
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      window.location.href = `${apiUrl}/api/auth/google`;
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('فشل تسجيل الدخول باستخدام Google');
    }
  };

  const handleGoogleCallback = async () => {
    try {
      // بعد العودة من Google، جلب معلومات المستخدم
      await fetchUserInfo();
      
      // العودة إلى الصفحة السابقة أو الصفحة الرئيسية
      const preAuthPath = sessionStorage.getItem('preAuthPath');
      sessionStorage.removeItem('preAuthPath');
      
      return preAuthPath || '/dashboard';
    } catch (error) {
      console.error('Google callback error:', error);
      
      // إذا كان المستخدم غير موجود بعد مصادقة Google
      if (error.response?.data?.error === 'User not found') {
        throw new Error('لم يتم العثور على حساب مرتبط بـ Google. يرجى التسجيل أولاً.');
      }
      
      throw new Error('فشل معالجة استجابة Google');
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    return !!token && isAuthenticated;
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const logout = (silent = false) => {
    // مسح البيانات المحلية
    localStorage.removeItem('token');
    sessionStorage.removeItem('preAuthPath');
    
    // تحديث حالة التطبيق
    setUser(null);
    setIsAuthenticated(false);
    
    // إذا لم يكن صامتاً، إعادة التوجيه إلى الصفحة الرئيسية
    if (!silent) {
      window.location.href = '/';
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const refreshUserData = async () => {
    try {
      await fetchUserInfo();
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // إذا فشل تحديث البيانات، قم بتسجيل الخروج صامتاً
      logout(true);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    handleGoogleCallback,
    checkAuthStatus,
    getToken,
    logout,
    updateUser,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};