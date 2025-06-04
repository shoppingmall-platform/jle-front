const GUEST_CART_KEY = 'guest_cart'
const EXPIRATION_MS = 1000 * 60 * 60 * 48 // 48시간

export const setGuestCart = (cartItems) => {
  try {
    const payload = {
      data: cartItems,
      expiresAt: Date.now() + EXPIRATION_MS,
    }
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(payload))
  } catch (err) {
    console.error('로컬스토리지에 비회원 장바구니 저장 실패', err)
  }
}

export const getGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(GUEST_CART_KEY)
      return []
    }
    return parsed.data || []
  } catch (err) {
    console.error('로컬스토리지에서 비회원 장바구니 불러오기 실패', err)
    return []
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
