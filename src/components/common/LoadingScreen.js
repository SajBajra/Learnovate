"use client"

import { motion } from "framer-motion"
import "./LoadingScreen.css"

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <motion.div
        className="loading-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="loading-logo">
          <span className="logo-text">MentorLink</span>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <motion.p
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Loading your experience...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
