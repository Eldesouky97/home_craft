import React from 'react'
import { motion } from 'framer-motion'
import { FaSpinner } from 'react-icons/fa'

export const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-4xl text-purple-600"
      >
        <FaSpinner />
      </motion.div>
    </div>
  )
}