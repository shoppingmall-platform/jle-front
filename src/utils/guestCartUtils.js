const GUEST_CART_KEY = 'guest_cart'

export const getGuestCart = () => {
  try {
    const data = localStorage.getItem(GUEST_CART_KEY)
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.error('로컬스토리지에서 비회원 장바구니 불러오기 실패', err)
    return []
  }
}

export const setGuestCart = (cartItems) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems))
  } catch (err) {
    console.error('로컬스토리지에 비회원 장바구니 저장 실패', err)
  }
}

export const addToGuestCart = (item) => {
  const cart = getGuestCart()

  const existingIndex = cart.findIndex(
    (existingItem) => existingItem.productOptionId === item.productOptionId,
  )

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }

  setGuestCart(cart)
}

export const removeFromGuestCart = (productOptionId) => {
  const cart = getGuestCart().filter((item) => item.productOptionId !== productOptionId)
  setGuestCart(cart)
}

export const updateGuestCartItem = (productOptionId, updates) => {
  const cart = getGuestCart().map((item) =>
    item.productOptionId === productOptionId ? { ...item, ...updates } : item,
  )
  setGuestCart(cart)
}

export const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY)
  } catch (err) {
    console.error('로컬스토리지 비우기 실패', err)
  }
}

export const updateGuestCartOption = (productOptionId, newOption) => {
  const cart = getGuestCart()
  const updatedCart = cart.map((item) =>
    item.productOptionId === productOptionId
      ? {
          ...item,
          productOptionId: newOption.productOptionId,
          productOptionDetails: newOption.productOptionDetails,
          discountedPrice: newOption.discountedPrice,
        }
      : item,
  )
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart))
  return updatedCart
}
