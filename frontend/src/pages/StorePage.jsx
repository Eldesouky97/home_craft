import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStore, FaShoppingCart, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch, FaUser, FaClock } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { FaShoppingBag } from "react-icons/fa";

const StorePage = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Mock store data - in real app, this would come from API
    const mockStore = {
      id: 1,
      name: 'متجري الأول',
      slug: slug,
      description: 'متجر مخصص للمنتجات اليدوية عالية الجودة. نقدم منتجات فريدة ومصنوعة بحب وعناية لتلبية جميع احتياجاتكم.',
      logo: null,
      coverImage: null,
      contact: {
        phone: '+966 50 123 4567',
        email: 'store@example.com',
        address: 'الرياض، المملكة العربية السعودية'
      },
      social: {
        instagram: '@store',
        twitter: '@store'
      },
      stats: {
        products: 12,
        orders: 25,
        rating: 4.5,
        reviews: 18
      }
    };

    // Mock products data - in real app, this would come from API
    const mockProducts = [
      {
        id: 1,
        name: 'منتج يدوي فاخر',
        description: 'منتج手工制作的精美工艺品، مصنوع من مواد عالية الجودة',
        price: 150,
        comparePrice: 200,
        images: [],
        category: 'المنتجات اليدوية',
        rating: 4.5,
        reviews: 12
      },
      {
        id: 2,
        name: 'حقيبة يدوية',
        description: 'حقيبة يدوية أنيقة ومناسبة للاستخدام اليومي',
        price: 299,
        comparePrice: null,
        images: [],
        category: 'الإكسسوارات',
        rating: 5,
        reviews: 8
      },
      {
        id: 3,
        name: 'مجوهرات فضية',
        description: 'مجوهرات فضية عالية الجودة مع أحجار كريمة',
        price: 450,
        comparePrice: 550,
        images: [],
        category: 'المجوهرات',
        rating: 4.8,
        reviews: 15
      },
      {
        id: 4,
        name: 'شموع معطرة',
        description: 'شموع معطرة手工制作 بروائح طبيعية فريدة',
        price: 75,
        comparePrice: null,
        images: [],
        category: 'المنتجات اليدوية',
        rating: 4.2,
        reviews: 6
      },
      {
        id: 5,
        name: 'لوحة فنية',
        description: 'لوحة فنية فريدة من نوعها، رسمت يدوياً بفنان محلي',
        price: 850,
        comparePrice: 1000,
        images: [],
        category: 'الفن',
        rating: 5,
        reviews: 3
      },
      {
        id: 6,
        name: 'وسائد مزخرفة',
        description: 'وسائد مزخرفة بأنماط تقليدية يدوية الصنع',
        price: 120,
        comparePrice: null,
        images: [],
        category: 'الديكور',
        rating: 4.7,
        reviews: 9
      }
    ];

    setStore(mockStore);
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, [slug]);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const handleAddToWishlist = (product) => {
    console.log('Added to wishlist:', product);
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المتجر...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <header className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-purple-600 to-purple-800 relative">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-8">
            <div className="container mx-auto">
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  {store.logo ? (
                    <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                  ) : (
                    <FaStore className="text-purple-600 text-3xl" />
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
                  <p className="text-purple-100 text-lg">{store.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Store Info */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <FaPhone className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">الهاتف</p>
                <p className="font-medium">{store.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <FaEnvelope className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="font-medium">{store.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">الموقع</p>
                <p className="font-medium">{store.contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Stats */}
      <section className="bg-purple-50 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FaShoppingBag, label: 'المنتجات', value: store.stats.products },
              { icon: FaClock, label: 'الطلبات', value: store.stats.orders },
              { icon: FaStar, label: 'التقييم', value: `${store.stats.rating}/5` },
              { icon: FaUser, label: 'المراجعات', value: store.stats.reviews }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, store }}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-6">لم يتم العثور على منتجات تطابق بحثك</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-6 z-50">
          <Link
            to="/cart"
            className="bg-purple-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center"
          >
            <FaShoppingCart className="ml-2" />
            السلة ({cart.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default StorePage;