import React from 'react'
import UserContent from './UserContent'
import UserFooter from './UserFooter'
import UserHeader from './UserHeader'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'

const UserLayout = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="wrapper d-flex flex-column min-vh-100">
          <UserHeader />
          <div className="body flex-grow-1 bg-white">
            <UserContent />
          </div>
          <UserFooter />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default UserLayout
