import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShoppingBag, FaChartLine, FaUsers, FaPlus, FaSearch, FaBell, FaCog, FaUser, FaArrowRight, FaEye, FaEdit, FaTrash, FaStar, FaShoppingCart } from 'react-icons/fa';
import StoreCard from '../components/StoreCard';

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setStores([
      {
        id: 1,
        name: 'متجري الأول',
        slug: 'my-first-store',
        description: 'متجر مخصص للمنتجات اليدوية عالية الجودة',
        logo: null,
        coverImage: null,
        productsCount: 12,
        ordersCount: 25,
        rating: 4.5,
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'متجر الأزياء',
        slug: 'fashion-store',
        description: 'أحدث صيحات الموضة والأزياء العصرية',
        logo: null,
        coverImage: null,
        productsCount: 35,
        ordersCount: 48,
        rating: 4.8,
        isActive: true,
        createdAt: '2024-02-01'
      }
    ]);

    setRecentOrders([
      {
        id: 1,
        orderNumber: 'ORD-001',
        customerName: 'أحمد محمد',
        storeName: 'متجري الأول',
        total: 299,
        status: 'مكتمل',
        date: '2024-03-15'
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customerName: 'سارة عبدالله',
        storeName: 'متجر الأزياء',
        total: 599,
        status: 'قيد المعالجة',
        date: '2024-03-14'
      }
    ]);

    setStats({
      totalStores: 2,
      totalProducts: 47,
      totalOrders: 73,
      totalRevenue: 15420
    });
  }, []);

  const handleCreateStore = (e) => {
    e.preventDefault();
    const store = {
      id: stores.length + 1,
      ...newStore,
      logo: null,
      coverImage: null,
      productsCount: 0,
      ordersCount: 0,
      rating: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStores([...stores, store]);
    setNewStore({ name: '', slug: '', description: '' });
    setShowCreateStore(false);
  };

  const handleEditStore = (store) => {
    console.log('Edit store:', store);
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
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-sm text-gray-600">مرحباً بعودتك إلى Home Craft</p>
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
                  <FaUser className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">المستخدم</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: FaStore,
              label: 'إجمالي المتاجر',
              value: stats.totalStores,
              color: 'from-purple-600 to-purple-800',
              bgColor: 'bg-purple-50'
            },
            {
              icon: FaShoppingBag,
              label: 'إجمالي المنتجات',
              value: stats.totalProducts,
              color: 'from-blue-600 to-blue-800',
              bgColor: 'bg-blue-50'
            },
            {
              icon: FaChartLine,
              label: 'إجمالي الطلبات',
              value: stats.totalOrders,
              color: 'from-green-600 to-green-800',
              bgColor: 'bg-green-50'
            },
            {
              icon: FaUsers,
              label: 'إجمالي الإيرادات',
              value: `${stats.totalRevenue.toLocaleString()} ريال`,
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
                >
                  <FaPlus className="ml-2" />
                  متجر جديد
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {stores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onEdit={handleEditStore}
                  />
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">الطلبات الأخيرة</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-medium text-gray-700">رقم الطلب</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">العميل</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">المتجر</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">المبلغ</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{order.orderNumber}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{order.customerName}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{order.storeName}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.total} ريال</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link to={`/orders/${order.id}`} className="text-purple-600 hover:text-purple-800">
                            عرض
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">النشاط الأخير</h3>
              <div className="space-y-4">
                {[
                  { action: 'إضافة منتج جديد', time: 'منذ 5 دقائق', icon: FaShoppingBag },
                  { action: 'طلب جديد', time: 'منذ 15 دقيقة', icon: FaShoppingCart },
                  { action: 'تحديث المتجر', time: 'منذ ساعة', icon: FaStore }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <activity.icon className="text-gray-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Tips */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">نصائح لتحسين الأداء</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaStar className="ml-2 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-purple-100">أضف صوراً عالية الجودة لمنتجاتك</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="ml-2 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-purple-100">استخدم أسعاراً تنافسية</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="ml-2 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-purple-100">رد بسرعة على استفسارات العملاء</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Create Store Modal */}
      {showCreateStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إنشاء متجر جديد</h3>
              <button
                onClick={() => setShowCreateStore(false)}
                className="text-gray-400 hover:text-gray-600"
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
                ></textarea>
              </div>

              <div className="flex space-x-3 space-x-reverse">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                >
                  إنشاء المتجر
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateStore(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
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

export default AdminDashboard;