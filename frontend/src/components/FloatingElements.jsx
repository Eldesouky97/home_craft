import React from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaHeart, FaGem, FaCrown } from 'react-icons/fa'

export const FloatingElements = () => {
  const elements = [
    { icon: FaStar, color: 'text-yellow-400', size: 20, delay: 0 },
    { icon: FaHeart, color: 'text-pink-400', size: 24, delay: 0.5 },
    { icon: FaGem, color: 'text-purple-400', size: 18, delay: 1 },
    { icon: FaCrown, color: 'text-yellow-300', size: 22, delay: 1.5 },
    { icon: FaStar, color: 'text-yellow-400', size: 16, delay: 2 },
    { icon: FaHeart, color: 'text-pink-400', size: 20, delay: 2.5 },
    { icon: FaGem, color: 'text-purple-400', size: 24, delay: 3 },
    { icon: FaCrown, color: 'text-yellow-300', size: 18, delay: 3.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => {
        const Icon = element.icon
        const top = Math.random() * 100
        const left = Math.random() * 100
        const animationDuration = 15 + Math.random() * 10

        return (
          <motion.div
            key={index}
            className={`absolute ${element.color} opacity-20`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${element.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: animationDuration,
              delay: element.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon />
          </motion.div>
        )
      })}
    </div>
  )
}