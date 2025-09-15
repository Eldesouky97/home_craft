import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    روابط_مفيدة: ['الرئيسية', 'من نحن', 'الخدمات', 'الأسعار', 'المدونة'],
    المستخدم: ['تسجيل الدخول', 'إنشاء حساب', 'المساعدة', 'الشروط والأحكام', 'سياسة الخصوصية'],
    الخدمات: ['إنشاء متجر', 'إدارة المنتجات', 'معالجة الطلبات', 'التحليلات', 'الدعم الفني']
  };

  const socialLinks = [
    { icon: FaFacebook, color: 'text-blue-600', hover: 'hover:text-blue-700' },
    { icon: FaTwitter, color: 'text-blue-400', hover: 'hover:text-blue-500' },
    { icon: FaInstagram, color: 'text-pink-600', hover: 'hover:text-pink-700' },
    { icon: FaLinkedin, color: 'text-blue-700', hover: 'hover:text-blue-800' },
    { icon: FaYoutube, color: 'text-red-600', hover: 'hover:text-red-700' }
  ];

  return (
    <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center animate-pulse">
                <FaStore className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Home Craft</h3>
                <p className="text-purple-200">منصتك الإلكترونية لإنشاء المتاجر وبيع المنتجات</p>
              </div>
            </div>
            <p className="text-purple-200 mb-6 leading-relaxed">
              نقدم منصة متطورة تمكنك من إنشاء متجرك الإلكتروني الخاص بسهولة وفعالية، مع تصميم أنيق وأدوات إدارة متقدمة.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FaEnvelope className="text-purple-400" />
                <span className="text-purple-200">info@homecraft.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <FaPhone className="text-purple-400" />
                <span className="text-purple-200">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <FaMapMarkerAlt className="text-purple-400" />
                <span className="text-purple-200">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Dynamic Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4 text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to="#"
                      className="text-purple-200 hover:text-white transition-colors duration-200 flex items-center"
                    >
                      <span className="w-1 h-1 bg-purple-400 rounded-full ml-2"></span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">النشرة البريدية</h4>
            <p className="text-purple-200 mb-4">اشترك للحصول على آخر التحديثات والعروض</p>
            <form className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full bg-purple-800/50 backdrop-blur-sm border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-purple-900 transition"
                >
                  اشترك
                </button>
              </div>
            </form>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">تابعنا</h4>
              <div className="flex space-x-4 space-x-reverse">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-10 h-10 bg-purple-800/50 backdrop-blur-sm rounded-full flex items-center justify-center ${social.color} ${social.hover} transition-all duration-200 hover:scale-110`}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-purple-300 mb-4 md:mb-0">
              © {currentYear} Home Craft. جميع الحقوق محفوظة.
            </div>
            <div className="flex items-center space-x-6 space-x-reverse text-purple-300">
              <Link to="#" className="hover:text-white transition">سياسة الخصوصية</Link>
              <Link to="#" className="hover:text-white transition">الشروط والأحكام</Link>
              <Link to="#" className="hover:text-white transition">خريطة الموقع</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;