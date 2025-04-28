'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const shippingCost = cartTotal > 50000 ? 0 : 3000

  // 로컬 스토리지에서 장바구니 정보 불러오기
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])

  // 장바구니 정보가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }

    // 장바구니 아이템 수와 총액 계산
    const count = cartItems.reduce((total, item) => total + item.quantity, 0)
    setCartItemsCount(count)

    const total = cartItems.reduce((total, item) => {
      const price = item.discountRate > 0 ? item.discountPrice : item.price
      return total + price * item.quantity
    }, 0)
    setCartTotal(total)
  }, [cartItems])

  // 장바구니에 상품 추가
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // 이미 장바구니에 있는 상품인지 확인
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor?.code === product.selectedColor?.code &&
          item.selectedSize === product.selectedSize,
      )

      if (existingItemIndex >= 0) {
        // 이미 있는 상품이면 수량만 증가
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // 새 상품이면 추가
        return [...prevItems, { ...product, quantity }]
      }
    })
  }

  // 장바구니 상품 수량 변경
  const updateCartItemQuantity = (item, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((cartItem) => {
        if (
          cartItem.id === item.id &&
          cartItem.selectedColor?.code === item.selectedColor?.code &&
          cartItem.selectedSize === item.selectedSize
        ) {
          const newQuantity = Math.max(1, cartItem.quantity + change)
          return { ...cartItem, quantity: newQuantity }
        }
        return cartItem
      })
    })
  }

  // 장바구니에서 상품 제거
  const removeFromCart = (item) => {
    setCartItems((prevItems) => {
      return prevItems.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.selectedColor?.code === item.selectedColor?.code &&
            cartItem.selectedSize === item.selectedSize
          ),
      )
    })
  }

  // 장바구니 비우기
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        cartTotal,
        shippingCost,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
