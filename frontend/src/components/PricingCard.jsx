import React from 'react';
import { FaCheck, FaStar, FaCrown } from 'react-icons/fa';

const PricingCard = ({ plan, isPopular = false }) => {
  const {
    name,
    price,
    period,
    description,
    features,
    buttonText = 'اختر الباقة',
    buttonVariant = isPopular ? 'primary' : 'secondary'
  } = plan;

  return (
    <div className={`relative group ${isPopular ? 'transform scale-105' : ''}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            <FaStar className="inline ml-2" />
            الأكثر شعبية
          </div>
        </div>
      )}

      <div className={`card-3d h-full ${
        isPopular 
          ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white border-2 border-yellow-400' 
          : 'bg-white text-gray-800 border border-purple-200'
      } rounded-2xl p-8 relative overflow-hidden`}>
        
        {/* Background Pattern */}
        <div className={`absolute inset-0 opacity-5 ${
          isPopular ? 'bg-white' : 'bg-purple-600'
        }`}></div>
        
        {/* Crown Icon for Popular */}
        {isPopular && (
          <div className="absolute top-4 right-4">
            <FaCrown className="text-yellow-400 text-2xl animate-pulse" />
          </div>
        )}

        <div className="relative z-10">
          {/* Plan Name */}
          <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-purple-900'}`}>
            {name}
          </h3>
          
          {/* Description */}
          <p className={`mb-6 ${isPopular ? 'text-purple-200' : 'text-gray-600'}`}>
            {description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-purple-900'}`}>
              {price}
              <span className={`text-lg ${isPopular ? 'text-purple-200' : 'text-gray-500'}`}>
                /{period}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center mb-3">
                <FaCheck className={`ml-3 flex-shrink-0 ${
                  isPopular ? 'text-green-400' : 'text-purple-600'
                }`} />
                <span className={isPopular ? 'text-purple-100' : 'text-gray-700'}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Button */}
          <button
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isPopular
                ? 'bg-white text-purple-700 hover:bg-purple-50 shadow-lg'
                : buttonVariant === 'primary'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-lg'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {buttonText}
          </button>
        </div>

        {/* Hover Effect */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
          isPopular ? 'bg-white' : 'bg-purple-600'
        }`}></div>
      </div>
    </div>
  );
};

export default PricingCard;