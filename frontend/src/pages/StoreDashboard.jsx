import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShoppingBag, FaChartLine, FaUsers, FaPlus, FaSearch, FaBell, FaCog, FaUser, FaShoppingCart, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import StoreCard from '../components/StoreCard';
import { useApp } from '../context/AppContext';

const StoreDashboard = () => {
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'general'
  });
  const [isCreating, setIsCreating] = useState(false);

  const { 
    user, 
    featuredStores, 
    stats, 
    isLoading, 
    error,
    fetchFeaturedStores,
    fetchStats,
    setError,
    setLoading
  } = useApp();

  useEffect(() => {
    // جلب البيانات عند تحميل المكون
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchFeaturedStores(),
          fetchStats()
        ]);
      } catch (err) {
        setError('فشل في تحميل بيانات لوحة التحكم');
        console.error('Error loading StoreDashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchFeaturedStores, fetchStats, setError, setLoading]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      // في التطبيق الحقيقي، سيتم استدعاء API لإنشاء متجر جديد
      // await storeAPI.create(newStore);
      
      // مؤقتاً: عرض رسالة للمستخدم
      alert('سيتم تنفيذ إنشاء المتجر عند اكتمال تكوين API الخلفي');
      
      setNewStore({ name: '', slug: '', description: '', category: 'general' });
      setShowCreateStore(false);
      
      // إعادة تحميل قائمة المتاجر
      fetchFeaturedStores();
    } catch (err) {
      setError('فشل في إنشاء المتجر. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditStore = (store) => {
    // سيتم تنفيذ هذه الوظيفة لاحقاً
    console.log('Edit store functionality will be implemented later');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'مكتمل':
        return 'bg-green-100 text-green-800';
      case 'قيد المعالجة':
        return 'bg-blue-100 text-blue-800';
      case 'ملغي':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <FaStore className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المتاجر</h1>
                <p className="text-sm text-gray-600">مرحباً بعودتك، {user?.name || 'المستخدم'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث..."
                  className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <FaBell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings */}
              <Link to="/settings" className="p-2 text-gray-600 hover:text-gray-800">
                <FaCog size={20} />
              </Link>
              
              {/* Profile */}
              <Link to="/profile" className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-white text-sm" />
                  )}
                </div>
                <span className="text-gray-700 font-medium">{user?.name || 'المستخدم'}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 ml-3" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: FaStore,
              label: 'إجمالي المتاجر',
              value: stats?.totalStores || 0,
              color: 'from-purple-600 to-purple-800',
              bgColor: 'bg-purple-50'
            },
            {
              icon: FaShoppingBag,
              label: 'إجمالي المنتجات',
              value: stats?.totalProducts || 0,
              color: 'from-blue-600 to-blue-800',
              bgColor: 'bg-blue-50'
            },
            {
              icon: FaChartLine,
              label: 'إجمالي الطلبات',
              value: stats?.totalOrders || 0,
              color: 'from-green-600 to-green-800',
              bgColor: 'bg-green-50'
            },
            {
              icon: FaUsers,
              label: 'إجمالي الإيرادات',
              value: stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString()} ريال` : '0 ريال',
              color: 'from-orange-600 to-orange-800',
              bgColor: 'bg-orange-50'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.color} text-xl`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stores Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">متاجري</h2>
                <button
                  onClick={() => setShowCreateStore(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <FaPlus className="ml-2" />
                      متجر جديد
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {featuredStores && featuredStores.length > 0 ? (
                  featuredStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onEdit={handleEditStore}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <FaStore className="text-gray-300 text-5xl mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد متاجر</h3>
                    <p className="text-gray-400 mb-4">ابدأ بإنشاء متجرك الأول لعرضه هنا</p>
                    <button
                      onClick={() => setShowCreateStore(true)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      إنشاء متجر جديد
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">الطلبات الأخيرة</h2>
              
              <div className="text-center py-12">
                <FaShoppingCart className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد طلبات حالياً</h3>
                <p className="text-gray-400">سيتم عرض الطلبات هنا عند توفرها</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Link
                  to="/products/new"
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-purple-700 font-medium">إضافة منتج</span>
                  <FaPlus className="text-purple-600" />
                </Link>
                <Link
                  to="/stores/new"
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-700 font-medium">إنشاء متجر</span>
                  <FaStore className="text-blue-600" />
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-green-700 font-medium">عرض الطلبات</span>
                  <FaShoppingCart className="text-green-600" />
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">آخر التحديثات</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaStore className="text-gray-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">تم تحميل لوحة التحكم</p>
                    <p className="text-xs text-gray-500">الآن</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaChartLine className="text-gray-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">تم تحديث الإحصائيات</p>
                    <p className="text-xs text-gray-500">منذ قليل</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Tips */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">نصائح للنجاح</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaStar className="ml-2 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-purple-100">أضف صوراً عالية الجودة للمنتجات</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="ml-2 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-purple-100">استخدم أوصافاً واضحة للمنتجات</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="ml-2 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-purple-100">تابع طلباتك بانتظام</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Create Store Modal */}
      {showCreateStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إنشاء متجر جديد</h3>
              <button
                onClick={() => setShowCreateStore(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isCreating}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">اسم المتجر</label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="أدخل اسم المتجر"
                  required
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">رابط المتجر</label>
                <input
                  type="text"
                  value={newStore.slug}
                  onChange={(e) => setNewStore({ ...newStore, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="رابط-المتجر"
                  required
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">وصف المتجر</label>
                <textarea
                  value={newStore.description}
                  onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="أدخل وصف المتجر"
                  disabled={isCreating}
                ></textarea>
              </div>

              <div className="flex space-x-3 space-x-reverse">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                  disabled={isCreating}
                >
                  {isCreating ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateStore(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                  disabled={isCreating}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;