"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export default function Login({ showEntrance }: { showEntrance: boolean }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const toggleView = () => setIsLogin(!isLogin)

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        setError(data.error || 'Signup failed')
        return
      }

      // router.push('/onboarding')
    } catch (error) {
      setError('Something went wrong')
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // router.push('/onboarding')
    } catch (error) {
      setError('Something went wrong')
    }
  }

  return (
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

        {/* Login/Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showEntrance ? 0 : 1, y: showEntrance ? 30 : 0 }}
          transition={{ duration: 0.6, delay: showEntrance ? 0 : 1 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin 
                  ? "Sign in to your account to continue" 
                  : "Sign up to get started with MatchaGoose"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2"
                onClick={isLogin ? handleLogin : handleSignup}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>

              {/* Show forgot password only for login */}
              {isLogin && (
                <div className="text-center">
                  <a href="#" className="text-sm text-green-600 hover:text-green-700">
                    Forgot your password?
                  </a>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

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
              {/* Toggle between login and signup */}
              <div className="text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={toggleView}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}