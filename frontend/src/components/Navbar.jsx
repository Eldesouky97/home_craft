import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaStore, FaUser, FaSearch, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <FaStore className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-white">Home Craft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link to="/cart" className="relative text-white hover:text-purple-200 transition">
                  <FaShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Link>
                
                <Link to="/StoreDashboard" className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center border-2 border-white/20">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-white" />
                    )}
                  </div>
                </Link>
                
                <div className="relative group">
                  <button className="text-white flex items-center">
                    {user.name}
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link 
                        to="/StoreDashboard" 
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        لوحة التحكم
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        الملف الشخصي
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        طلباتي
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link
                  to="/login"
                  className="bg-white text-purple-700 px-4 py-2 rounded-full hover:bg-purple-50 transition"
                >
                   تسجيل الدخول
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass rounded-2xl p-6">

            <div className="flex flex-col space-y-4">
              
              {user && (
                <>
                  <Link to="/cart" className="text-white hover:text-purple-200 transition flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <FaShoppingCart className="ml-2" />
                    عربة التسوق
                    <span className="mr-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Link>
                  <Link to="/StoreDashboard" className="text-white hover:text-purple-200 transition" onClick={() => setIsMenuOpen(false)}>
                    لوحة التحكم
                  </Link>
                  <Link to="/profile" className="text-white hover:text-purple-200 transition" onClick={() => setIsMenuOpen(false)}>
                    الملف الشخصي
                  </Link>
                  <Link to="/orders" className="text-white hover:text-purple-200 transition" onClick={() => setIsMenuOpen(false)}>
                    طلباتي
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-white/20 mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full bg-white text-purple-700 px-4 py-2 rounded-full hover:bg-purple-50 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                   تسجيل الدخول 
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;