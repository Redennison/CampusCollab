"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [showEntrance, setShowEntrance] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntrance(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

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
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.3,
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
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                >
                  <Image
                    src="/matchagoose-logo.png"
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
                  duration: 0.8,
                  delay: 1.5,
                }}
              >
                <motion.h1
                  className="text-2xl md:text-3xl font-light text-gray-700 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  Welcome to
                </motion.h1>
                <motion.div
                  className="text-4xl md:text-5xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  <span className="text-gray-800">MATCHA</span>
                  <span className="text-green-600">GOOSE</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app content (shown after entrance slides up) */}
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showEntrance ? 0 : 1, y: showEntrance ? 50 : 0 }}
        transition={{ duration: 0.8, delay: showEntrance ? 0 : 0.5 }}
      >
        <div className="w-full max-w-md">
          {/* Small logo at top */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showEntrance ? 0 : 1, y: showEntrance ? -20 : 0 }}
            transition={{ duration: 0.6, delay: showEntrance ? 0 : 0.8 }}
          >
            <Image
              src="/matchagoose-logo.png"
              alt="MatchaGoose"
              width={80}
              height={80}
              className="w-16 h-auto mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-gray-800">MATCHA</span>
              <span className="text-green-600">GOOSE</span>
            </h1>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showEntrance ? 0 : 1, y: showEntrance ? 30 : 0 }}
            transition={{ duration: 0.6, delay: showEntrance ? 0 : 1 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-gray-800">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">Sign in to your account to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2">Sign In</Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-green-600 hover:text-green-700">
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    Google
                  </Button>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    GitHub
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-600">
                  {"Don't have an account? "}
                  <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
