import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaStore, FaShoppingCart, FaMobile, FaHeart, FaStar, FaArrowLeft } from 'react-icons/fa'
import { Canvas } from '@react-three/fiber'
import { Box, Sphere, Text } from '@react-three/drei'
import { useAuth } from '../context/AuthContext'

export const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: FaStore,
      title: 'إنشاء متجر إلكتروني',
      description: 'أنشئ متجرك الإلكتروني الخاص في دقائق مع تصميم احترافي',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FaShoppingCart,
      title: 'بيع منتجاتك',
      description: 'اعرض وبيع منتجاتك بسهولة مع نظام دفع آمن',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: FaMobile,
      title: 'متجرك على الموبايل',
      description: 'متجرك متجاوب ويعمل على جميع الأجهزة',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: FaHeart,
      title: 'دعم فني متكامل',
      description: 'فريق دعم متخصص لمساعدتك في كل خطوة',
      color: 'from-pink-600 to-purple-600',
    },
  ]

  const testimonials = [
    {
      name: 'سارة أحمد',
      store: 'متجر الملابس الأنيقة',
      rating: 5,
      comment: 'منصة رائعة وسهلة الاستخدام. تمكنت من إنشاء متجري في أقل من ساعة!',
    },
    {
      name: 'محمد خالد',
      store: 'متجر الإلكترونيات',
      rating: 5,
      comment: 'أفضل منصة للمتاجر الإلكترونية في مصر. الدعم الفني ممتاز جداً.',
    },
    {
      name: 'نورا محمد',
      store: 'متجر المستلزمات النسائية',
      rating: 5,
      comment: 'التصميم جميل جداً والمنصة سريعة. أنصح بها بشدة لكل صاحب عمل.',
    },
  ]

  const FloatingCube = () => {
    return (
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="#a855f7" transparent opacity={0.8} />
        </Box>
      </mesh>
    )
  }

  const FloatingSphere = () => {
    return (
      <mesh position={[2, 0, 0]}>
        <Sphere args={[0.7, 32, 32]}>
          <meshStandardMaterial color="#d946ef" transparent opacity={0.8} />
        </Sphere>
      </mesh>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-gradient mb-6"
              >
                مرحباً بك في
                <br />
                <span className="text-6xl md:text-8xl">Home Craft</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
              >
                منصتك المثالية لإنشاء المتاجر الإلكترونية
                <br />
                وبيع منتجاتك بسهولة واحترافية
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {user ? (
                  <Link
                    to="/create-store"
                    className="btn-primary text-lg"
                  >
                    إنشاء متجرك الآن
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary text-lg"
                    >
                      ابدأ الآن مجاناً
                    </Link>
                    <Link
                      to="/login"
                      className="btn-secondary text-lg"
                    >
                      تسجيل الدخول
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-96 lg:h-full"
            >
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FloatingCube />
                <FloatingSphere />
                <motion.group
                  animate={{
                    rotation: [0, Math.PI * 2],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Text
                    position={[0, -2, 0]}
                    fontSize={0.5}
                    color="#a855f7"
                    anchorX="center"
                    anchorY="middle"
                  >
                    Home Craft
                  </Text>
                </motion.group>
              </Canvas>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              لماذا تختار Home Craft؟
            </h2>
            <p className="text-xl text-gray-700">
              نقدم لك كل ما تحتاجه لإنشاء متجرك الإلكتروني بنجاح
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="feminine-card p-6 text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Icon size={24} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-xl text-gray-700">
              تجارب ناجحة من عملائنا الكرام
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="feminine-card p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="mr-4">
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.store}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 ml-1" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            هل أنت مستعد لبدء متجرك الإلكتروني؟
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-purple-100 mb-8"
          >
            انضم إلى آلاف البائعين الناجحين وابدأ رحلتك في عالم التجارة الإلكترونية
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {user ? (
              <Link
                to="/create-store"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                إنشاء متجرك الآن
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                ابدأ مجاناً
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}