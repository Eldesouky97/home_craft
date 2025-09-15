import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaEye, FaEdit, FaShoppingCart, FaStar, FaChartLine, FaUsers } from 'react-icons/fa';

const StoreCard = ({ store, onView, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    name,
    slug,
    description,
    logo,
    coverImage,
    productsCount = 0,
    ordersCount = 0,
    rating,
    isActive = true,
    createdAt
  } = store;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="group relative">
      <div className="card-3d bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
        
        {/* Cover Image */}
        <div className="relative h-32 overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${name} cover`}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-purple-800"></div>
          )}

          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
            isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {isActive ? 'نشط' : 'غير نشط'}
          </div>

          {/* Logo */}
          <div className="absolute -bottom-8 right-4">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg p-2">
              {logo ? (
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <FaStore className="text-white text-xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="pt-10 pb-6 px-6">
          {/* Store Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
          
          {/* Store Slug */}
          <p className="text-sm text-purple-600 mb-3">/{slug}</p>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description || 'لا يوجد وصف متاح'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaShoppingCart className="text-purple-600 mr-1" />
                <span className="text-lg font-bold text-purple-900">{productsCount}</span>
              </div>
              <p className="text-xs text-gray-500">منتج</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaChartLine className="text-green-600 mr-1" />
                <span className="text-lg font-bold text-green-900">{ordersCount}</span>
              </div>
              <p className="text-xs text-gray-500">طلب</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaUsers className="text-blue-600 mr-1" />
                <span className="text-lg font-bold text-blue-900">{rating || '4.5'}</span>
              </div>
              <p className="text-xs text-gray-500">تقييم</p>
            </div>
          </div>

          {/* Created Date */}
          <p className="text-xs text-gray-400 mb-4">
            إنشاء: {formatDate(createdAt)}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-2 space-x-reverse">
            <Link
              to={`/store/${slug}`}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <FaEye className="ml-2" />
              عرض
            </Link>
            <button
              onClick={() => onEdit && onEdit(store)}
              className="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              <FaEdit />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 bg-purple-600 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default StoreCard;