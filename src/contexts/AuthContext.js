'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // 로그인
  const login = async (credentials) => {
    try {
      // 실제 구현 시에는 API 호출
      // const response = await authService.login(credentials)

      // 임시 구현
      const mockUser = {
        id: '1',
        name: '홍길동',
        email: credentials.email,
        role: 'user',
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 로그아웃
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  // 회원가입
  const register = async (userData) => {
    try {
      // 실제 구현 시에는 API 호출
      // const response = await authService.register(userData)

      // 임시 구현
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'user',
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
