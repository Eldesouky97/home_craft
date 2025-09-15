import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShoppingBag, FaUsers, FaChartLine, FaStar, FaArrowRight, FaPlay, FaCheck, FaShieldAlt, FaBolt, FaMagic } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingCard from '../components/PricingCard';
import { useApp } from '../context/AppContext';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  
  const { 
    featuredStores, 
    featuredProducts, 
    stats, 
    isLoading, 
    error,
    fetchFeaturedStores,
    fetchFeaturedProducts,
    fetchStats
  } = useApp();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // تحديث البيانات عند تحميل المكون
  useEffect(() => {
    if (featuredStores.length === 0) {
      fetchFeaturedStores();
    }
    if (featuredProducts.length === 0) {
      fetchFeaturedProducts();
    }
    if (!stats) {
      fetchStats();
    }
  }, [fetchFeaturedStores, fetchFeaturedProducts, fetchStats, featuredStores.length, featuredProducts.length, stats]);

  // بيانات تجريبية للباقات (يمكن استبدالها ببيانات حقيقية من API)
  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      price: "500",
      period: "شهرياً",
      description: "مثالية للاستخدام التجريبي",
      features: [
        "متجر واحد",
        "عدد محدود من المنتجات",
        "دعم بالبريد الإلكتروني",
        "تصاميم أساسية",
        "تقارير بسيطة"
      ]
    },
    {
      name: "الباقة الاحترافية",
      price: "1000",
      period: "شهرياً",
      description: "مثالية للفرق الصغيرة",
      features: [
        "عدد 2 متجر إحترافي",
        " 50 منتج لكل متجر",
        "دعم على مدار الساعة",
        "تصاميم متقدمة",
        "تحليلات وتقارير",
        "API متقدم"
      ]
    },
    {
      name: "الباقة المتقدمة",
      price: "2000",
      period: "شهرياً",
      description: "مثالية للمؤسسات",
      features: [
        "مساحة تخزين غير محدودة",
        "متاجر غير محدودة",
        "دعم مخصص",
        "تصاميم مخصصة",
        "تحليلات متقدمة",
        "وصول API كامل",
        "مدير حساب مخصص"
      ]
    }
  ];

  const features = [
    {
      icon: FaStore,
      title: "متاجر إلكترونية احترافية",
      description: "أنشئ متجرك الإلكتروني الخاص بسهولة مع تصميم عصري ومتجاوب",
      color: "from-purple-600 to-purple-800"
    },
    {
      icon: FaShoppingBag,
      title: "إدارة متقدمة للمنتجات",
      description: "أضف وأدر منتجاتك بسهولة مع تحكم كامل في المخزون والأسعار",
      color: "from-blue-600 to-blue-800"
    },
    {
      icon: FaUsers,
      title: "إدارة العملاء والطلبات",
      description: "تتبع طلباتك وإدارة عملائك بفعالية من لوحة تحكم واحدة",
      color: "from-green-600 to-green-800"
    },
    {
      icon: FaChartLine,
      title: "تحليلات وتقارير مفصلة",
      description: "احصل على رؤى عميقة حول أداء متجرك ومبيعاتك",
      color: "from-orange-600 to-orange-800"
    },
    {
      icon: FaShieldAlt,
      title: "أمان وحماية متقدمة",
      description: "حماية قوية لبياناتك ومعاملاتك المالية",
      color: "from-red-600 to-red-800"
    },
    {
      icon: FaBolt,
      title: "سرعة وأداء فائق",
      description: "منصة سريعة ومستقرة تضمن تجربة مستخدم ممتازة",
      color: "from-yellow-600 to-yellow-800"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "صاحب متجر أزياء",
      content: "Home Craft غيرت طريقة عملي تماماً. أصبحت أدير متجري بسهولة وأرى نمو المبيعات بشكل يومي.",
      rating: 5
    },
    {
      name: "سارة عبدالله",
      role: "بائعة منتجات يدوية",
      content: "المنصة سهلة الاستخدام جداً والدعم الفني ممتاز. أنصح بها أي بائع يريد التطور.",
      rating: 5
    },
    {
      name: "محمد خالد",
      role: "مدير متجر إلكتروني",
      content: "تصميم المنصة أنيق واحترافي. الميزات المتقدمة ساعدتني في زيادة مبيعاتي بنسبة 200%.",
      rating: 5
    }
  ];

  // استخدام الإحصائيات الحقيقية من API إذا كانت متاحة
  const displayStats = stats || [
    { value: "50K+", label: "مستخدم نشط", icon: FaUsers },
    { value: "2M+", label: "منتج مُدرج", icon: FaShoppingBag },
    { value: "99.9%", label: "رضا العملاء", icon: FaStar },
    { value: "24/7", label: "دعم فني", icon: FaShieldAlt }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ml-1`} />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slideInRight">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-purple-800/50 backdrop-blur-sm rounded-full text-purple-200 text-sm">
                  <FaMagic className="ml-2" />
                  منصة متطورة لإنشاء المتاجر الإلكترونية
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                ابدأ رحلتك الإبداعية
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  مع Home Craft
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed">
                انشئ متجرك الإلكتروني الخاص وابدأ في بيع منتجاتك بسهولة واحترافية
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ابدأ الآن
                  <FaArrowRight className="inline mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="glass text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
                  شاهد الفيديو
                  <FaPlay className="inline mr-2" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center space-x-8 space-x-reverse">
                {displayStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="text-purple-400 text-2xl mr-2" />
                      <span className="text-3xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-purple-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="animate-slideInLeft">
              <div className="relative">
                {/* Main Card */}
                <div className="card-3d bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">خدمة تصميم احترافية</h3>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      نشط
                    </span>
                  </div>
                  
                  <p className="text-purple-200 mb-6">
                    باقة متكاملة لإنشاء متجرك الإلكتروني مع جميع المميزات المتقدمة
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    {[
                      { icon: FaCheck, text: "تحديثات يومية" },
                      { icon: FaCheck, text: "دعم على مدار الساعة 24/7" },
                      { icon: FaCheck, text: "تصاميم عصرية" },
                      { icon: FaCheck, text: "سهولة الاستخدام" },
                      { icon: FaCheck, text: "أمان متقدم" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <item.icon className="text-green-400 ml-3" />
                        <span className="text-purple-100">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div>
                      <span className="text-3xl font-bold text-white">5000</span>
                      <span className="text-purple-200 ml-2">جنيه/شهر</span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                      اختر هذه الباقة
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-float opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-float opacity-50" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll" id="features">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              لماذا تختار Home Craft؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              منصة متكاملة توفر لك كل ما تحتاجه لإنشاء وإدارة متجرك الإلكتروني بنجاح
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group animate-on-scroll"
                id={`feature-${index}`}
                style={{transitionDelay: `${index * 0.1}s`}}
              >
                <div className="card-3d bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-purple-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll" id="pricing">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              اختر الباقة المناسبة لعملك
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              خطط مرنة تناسب احتياجاتك مع إمكانية الترقية في أي وقت
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="animate-on-scroll" id={`pricing-${index}`}>
                <PricingCard
                  plan={plan}
                  isPopular={index === 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll" id="testimonials">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-xl text-gray-600">
              آراء حقيقية من مستخدمي منصة Home Craft
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-purple-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2 space-x-reverse">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-purple-600 w-8' : 'bg-purple-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-on-scroll" id="cta">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              هل أنت مستعد لبدء رحلتك؟
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              انضم إلى آلاف البائعين الذين بدأوا متاجرهم الناجحة مع Home Craft
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;