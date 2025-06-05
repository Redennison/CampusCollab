"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Login from "@/components/Login"

export default function Component() {
  const [showEntrance, setShowEntrance] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const timer = setTimeout(() => {
      setShowEntrance(false)
    }, 2500) 

    return () => clearTimeout(timer)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        {showEntrance && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100"
            initial={{ opacity: 1, y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-200 rounded-full opacity-30"
                  initial={{
                    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                    y: (typeof window !== "undefined" ? window.innerHeight : 1000) + 50,
                    scale: 0,
                  }}
                  animate={{
                    y: -50,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Main logo container */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {/* Logo with floating animation */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  // initial={{
                  //   rotateY: 90,
                  //   opacity: 0,
                  // }}
                  // animate={{
                  //   rotateY: 0,
                  //   opacity: 1,
                  // }}
                  // transition={{
                  //   duration: 0.8,
                  //   ease: "easeOut",
                  // }}
                  initial={{
                    scale: 1.5,
                    opacity: 0,
                    filter: "blur(10px)",
                  }}
                    animate={{
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                  }}
                    transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="MatchaGoose Logo"
                    width={300}
                    height={300}
                    className="w-64 h-auto md:w-80"
                    priority
                  />
                </motion.div>

                {/* Glow effect behind logo */}
                <motion.div
                  className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-20 -z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </motion.div>

              {/* Welcome text */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6, 
                  delay: 0.6,  
                }}
              >
                <motion.h1
                  className="text-2xl md:text-3xl font-light text-gray-700 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }} 
                >
                  Welcome to
                </motion.h1>
                <motion.div
                  className="text-4xl md:text-5xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }} 
                >
                  <span className="text-gray-800">MATCHA</span>
                  <span className="text-green-600">GOOSE</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Login showEntrance={showEntrance} />
    </div>
  )
}
