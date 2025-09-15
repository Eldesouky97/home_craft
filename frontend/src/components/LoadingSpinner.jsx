import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin">
          {/* Inner Ring */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin"
               style={{ animationDelay: '0.5s' }}>
            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute -top-8 -right-8 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-8 -left-8 w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        
        {/* Loading Text */}
        <div className="mt-8 text-center">
          <p className="text-purple-600 font-medium animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;