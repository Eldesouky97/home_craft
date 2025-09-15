import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch,FaEye, FaEdit, FaTrash, FaBox } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { FaArrowRight } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
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
        reviews: 12,
        store: { name: 'متجري الأول', slug: 'my-first-store' }
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
        reviews: 8,
        store: { name: 'متجر الأزياء', slug: 'fashion-store' }
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
        reviews: 15,
        store: { name: 'متجري الأول', slug: 'my-first-store' }
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
        reviews: 6,
        store: { name: 'متجر الأزياء', slug: 'fashion-store' }
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
        reviews: 3,
        store: { name: 'متجري الأول', slug: 'my-first-store' }
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
        reviews: 9,
        store: { name: 'متجر الأزياء', slug: 'fashion-store' }
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

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

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
  };

  const handleAddToWishlist = (product) => {
    console.log('Added to wishlist:', product);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      comparePrice: null,
      images: [],
      category: newProduct.category,
      rating: 0,
      reviews: 0,
      store: { name: 'متجري الأول', slug: 'my-first-store' }
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', description: '', price: '', category: '', stock: '' });
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
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
              <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
            </div>
            
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <FaPlus className="ml-2" />
              إضافة منتج
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="name">الترتيب حسب الاسم</option>
              <option value="price-low">السعر: من الأقل إلى الأعلى</option>
              <option value="price-high">السعر: من الأعلى إلى الأقل</option>
              <option value="rating">التقييم</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-purple-50 rounded-xl">
              <span className="text-purple-700 font-medium">
                {filteredProducts.length} منتج
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
                
                {/* Admin Actions */}
                <div className="mt-4 flex space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                    <FaEye className="inline ml-1" />
                    عرض
                  </button>
                  <button className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm">
                    <FaEdit className="inline ml-1" />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <FaTrash className="inline ml-1" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إضافة منتج جديد</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">اسم المنتج</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">وصف المنتج</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="أدخل وصف المنتج"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">السعر</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">المخزون</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">التصنيف</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="">اختر التصنيف</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 space-x-reverse">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                >
                  إضافة المنتج
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
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

export default Products;