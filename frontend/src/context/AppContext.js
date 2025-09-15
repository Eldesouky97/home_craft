import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, storeAPI, productAPI, statsAPI } from '../services/api';

// الحالة الابتدائية
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  featuredStores: [],
  featuredProducts: [],
  stats: null,
  error: null,
};

// أنواع الأحداث
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_FEATURED_STORES: 'SET_FEATURED_STORES',
  SET_FEATURED_PRODUCTS: 'SET_FEATURED_PRODUCTS',
  SET_STATS: 'SET_STATS',
  LOGOUT: 'LOGOUT',
};

// Reducer لإدارة الحالة
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTION_TYPES.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    case ACTION_TYPES.SET_FEATURED_STORES:
      return { ...state, featuredStores: action.payload, isLoading: false };
    case ACTION_TYPES.SET_FEATURED_PRODUCTS:
      return { ...state, featuredProducts: action.payload, isLoading: false };
    case ACTION_TYPES.SET_STATS:
      return { ...state, stats: action.payload, isLoading: false };
    case ACTION_TYPES.LOGOUT:
      return { 
        ...initialState, 
        isLoading: false,
        isAuthenticated: false 
      };
    default:
      return state;
  }
};

// إنشاء Context
const AppContext = createContext();

// مكون Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // دوال المساعدة
  const setLoading = (loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  };

  const setUser = (user) => {
    dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
  };

  const setFeaturedStores = (stores) => {
    dispatch({ type: ACTION_TYPES.SET_FEATURED_STORES, payload: stores });
  };

  const setFeaturedProducts = (products) => {
    dispatch({ type: ACTION_TYPES.SET_FEATURED_PRODUCTS, payload: products });
  };

  const setStats = (stats) => {
    dispatch({ type: ACTION_TYPES.SET_STATS, payload: stats });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: ACTION_TYPES.LOGOUT });
  };

  // دالة التسجيل
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل الدخول
  
const login = async (credentials) => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await authAPI.login(credentials);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'فشل في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  // دوال لجلب البيانات من API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      // في حالة خطأ 401 (غير مصرح) لا نعرض خطأ للمستخدم
      if (error.response?.status !== 401) {
        setError(error.response?.data?.message || 'فشل في تحميل بيانات المستخدم');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedStores = async () => {
    try {
      const response = await storeAPI.getFeatured();
      setFeaturedStores(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'فشل في تحميل المتاجر المميزة');
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getFeatured();
      setFeaturedProducts(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'فشل في تحميل المنتجات المميزة');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getStoreDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('فشل في تحميل الإحصائيات:', error);
    }
  };

  // تحميل البيانات الأولية عند التحميل
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('فشل في تحميل بيانات المستخدم:', error);
        }
      } else {
        setLoading(false);
      }

      // جلب البيانات العامة
      try {
        await Promise.all([
          fetchFeaturedStores(),
          fetchFeaturedProducts(),
          fetchStats()
        ]);
      } catch (error) {
        console.error('فشل في تحميل البيانات الأولية:', error);
      }
    };

    initApp();
  }, []);

  // القيم التي سيتم توفيرها
  const value = {
    // الحالة
    ...state,
    
    // دوال تعديل الحالة
    setLoading,
    setError,
    setUser,
    setFeaturedStores,
    setFeaturedProducts,
    setStats,
    logout,
    
    // دوال المصادقة
    register,
    login,
    
    // دوال جلب البيانات
    fetchUserProfile,
    fetchFeaturedStores,
    fetchFeaturedProducts,
    fetchStats,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;