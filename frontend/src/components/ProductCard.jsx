import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaEye, FaStar, FaTag } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    id,
    name,
    description,
    price,
    comparePrice,
    images,
    category,
    rating,
    reviews,
    store,
    slug
  } = product;

  const discountPercentage = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist && onAddToWishlist(product);
  };

  return (
    <div className="group relative">
      {/* Card */}
      <div className="card-3d bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <div className="text-purple-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0 0 2h.14l.76 5.25A2 2 0 0 0 7.86 18h8.28a2 2 0 0 0 1.96-1.75L18.86 9H19a1 1 0 0 0 0-2zM10 6a2 2 0 0 1 4 0v1h-4V6z"/>
                </svg>
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
              <FaTag className="inline ml-1" />
              {discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <FaHeart />
          </button>

          {/* Quick Actions Overlay */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center space-x-4 space-x-reverse transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link
              to={`/store/${store?.slug}`}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <FaEye />
            </Link>
            <button
              onClick={handleAddToCart}
              className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Category */}
          <div className="text-sm text-purple-600 mb-2">{category}</div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Rating */}
          {rating && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } text-sm`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 mr-2">({reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-2xl font-bold text-purple-900">{price} ريال</span>
                {comparePrice && (
                  <span className="text-sm text-gray-500 line-through">{comparePrice} ريال</span>
                )}
              </div>
            </div>
          </div>

          {/* Store Name */}
          {store && (
            <Link
              to={`/store/${store.slug}`}
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              من {store.name}
            </Link>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 bg-purple-600 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;