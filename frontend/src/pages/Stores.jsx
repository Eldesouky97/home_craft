import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaStore, FaShoppingBag, FaChartLine, FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import StoreCard from '../components/StoreCard';
import { FaArrowRight } from "react-icons/fa";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    description: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockStores = [
      {
        id: 1,
        name: 'متجري الأول',
        slug: 'my-first-store',
        description: 'متجر مخصص للمنتجات اليدوية عالية الجودة. نقدم منتجات فريدة ومصنوعة بحب وعناية.',
        logo: null,
        coverImage: null,
        productsCount: 12,
        ordersCount: 25,
        rating: 4.5,
        isActive: true,
        contact: {
          phone: '+966 50 123 4567',
          email: 'store1@example.com',
          address: 'الرياض، المملكة العربية السعودية'
        },
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'متجر الأزياء',
        slug: 'fashion-store',
        description: 'أحدث صيحات الموضة والأزياء العصرية للرجال والنساء. تصاميم أنيقة بأسعار مناسبة.',
        logo: null,
        coverImage: null,
        productsCount: 35,
        ordersCount: 48,
        rating: 4.8,
        isActive: true,
        contact: {
          phone: '+966 55 987 6543',
          email: 'fashion@example.com',
          address: 'جدة، المملكة العربية السعودية'
        },
        createdAt: '2024-02-01'
      },
      {
        id: 3,
        name: 'متجر المجوهرات',
        slug: 'jewelry-store',
        description: 'مجوهرات فضية وذهبية عالية الجودة مع أحجار كريمة. إكسسوارات فاخرة لكل المناسبات.',
        logo: null,
        coverImage: null,
        productsCount: 28,
        ordersCount: 32,
        rating: 4.9,
        isActive: true,
        contact: {
          phone: '+966 53 456 7890',
          email: 'jewelry@example.com',
          address: 'الدمام، المملكة العربية السعودية'
        },
        createdAt: '2024-02-15'
      },
      {
        id: 4,
        name: 'متجر الديكور',
        slug: 'home-decor',
        description: 'ديكورات منزلية فريدة وأدوات منزلية عصرية. اجعل منزلك مكاناً جميلاً ومريحاً.',
        logo: null,
        coverImage: null,
        productsCount: 45,
        ordersCount: 67,
        rating: 4.7,
        isActive: true,
        contact: {
          phone: '+966 54 321 0987',
          email: 'decor@example.com',
          address: 'الخبر، المملكة العربية السعودية'
        },
        createdAt: '2024-03-01'
      },
      {
        id: 5,
        name: 'متجر الإلكترونيات',
        slug: 'electronics-store',
        description: 'أحدث الأجهزة الإلكترونية والهواتف الذكية. ضمان الجودة والسعر التنافسي.',
        logo: null,
        coverImage: null,
        productsCount: 62,
        ordersCount: 89,
        rating: 4.6,
        isActive: true,
        contact: {
          phone: '+966 56 789 0123',
          email: 'electronics@example.com',
          address: 'الطائف، المملكة العربية السعودية'
        },
        createdAt: '2024-03-10'
      },
      {
        id: 6,
        name: 'متجر الهدايا',
        slug: 'gifts-store',
        description: 'هدايا فريدة ومبتكرة لكل المناسبات. اجعل كل لحظة خاصة مع هدايا من متجرنا.',
        logo: null,
        coverImage: null,
        productsCount: 38,
        ordersCount: 54,
        rating: 4.8,
        isActive: true,
        contact: {
          phone: '+966 57 654 3210',
          email: 'gifts@example.com',
          address: 'تبوك، المملكة العربية السعودية'
        },
        createdAt: '2024-03-20'
      }
    ];

    setStores(mockStores);
    setFilteredStores(mockStores);
  }, []);

  useEffect(() => {
    let filtered = stores;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'products':
          return b.productsCount - a.productsCount;
        case 'orders':
          return b.ordersCount - a.ordersCount;
        default:
          return 0;
      }
    });

    setFilteredStores(filtered);
  }, [stores, searchTerm, sortBy]);

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
      contact: {
        phone: newStore.phone,
        email: newStore.email,
        address: newStore.address
      },
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStores([...stores, store]);
    setNewStore({
      name: '',
      slug: '',
      description: '',
      phone: '',
      email: '',
      address: ''
    });
    setShowCreateStore(false);
  };

  const handleViewStore = (store) => {
    // Navigate to store page
    console.log('View store:', store);
  };

  const handleEditStore = (store) => {
    // Edit store logic
    console.log('Edit store:', store);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/dashboard" className="text-purple-600 hover:text-purple-800">
                <FaArrowRight className="ml-2" />
                العودة إلى لوحة التحكم
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">المتاجر</h1>
            </div>
            
            <button
              onClick={() => setShowCreateStore(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <FaPlus className="ml-2" />
              إنشاء متجر
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: FaStore,
              label: 'إجمالي المتاجر',
              value: stores.length,
              color: 'from-purple-600 to-purple-800',
              bgColor: 'bg-purple-50'
            },
            {
              icon: FaShoppingBag,
              label: 'إجمالي المنتجات',
              value: stores.reduce((sum, store) => sum + store.productsCount, 0),
              color: 'from-blue-600 to-blue-800',
              bgColor: 'bg-blue-50'
            },
            {
              icon: FaChartLine,
              label: 'إجمالي الطلبات',
              value: stores.reduce((sum, store) => sum + store.ordersCount, 0),
              color: 'from-green-600 to-green-800',
              bgColor: 'bg-green-50'
            },
            {
              icon: FaUsers,
              label: 'متوسط التقييم',
              value: (stores.reduce((sum, store) => sum + store.rating, 0) / stores.length).toFixed(1),
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث عن متجر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="name">الترتيب حسب الاسم</option>
              <option value="rating">التقييم</option>
              <option value="products">عدد المنتجات</option>
              <option value="orders">عدد الطلبات</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-purple-50 rounded-xl">
              <span className="text-purple-700 font-medium">
                {filteredStores.length} متجر
              </span>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onView={handleViewStore}
                onEdit={handleEditStore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaStore className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد متاجر</h3>
            <p className="text-gray-600 mb-6">لم يتم العثور على متاجر تطابق بحثك</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              مسح البحث
            </button>
          </div>
        )}
      </div>

      {/* Create Store Modal */}
      {showCreateStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl animate-fadeIn">
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
              <div className="grid md:grid-cols-2 gap-4">
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
                  <label className="block text-gray-700 font-medium mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={newStore.phone}
                      onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="أدخل رقم الهاتف"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={newStore.email}
                      onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="أدخل البريد الإلكتروني"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">وصف المتجر</label>
                <textarea
                  value={newStore.description}
                  onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="أدخل وصف المتجر"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">العنوان</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="أدخل العنوان"
                    required
                  />
                </div>
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

export default Stores;