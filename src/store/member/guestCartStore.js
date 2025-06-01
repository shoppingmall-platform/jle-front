import { create } from 'zustand'
import {
  getGuestCart,
  setGuestCart,
  clearGuestCart,
  updateGuestCartOption,
} from '@/utils/guestCartUtils'

const useGuestCartStore = create((set, get) => ({
  cartItems: getGuestCart(), // 초기값은 로컬스토리지에 있는 장바구니

  // 장바구니 추가
  addItem: (item) => {
    const currentItems = get().cartItems
    const exists = currentItems.find((i) => i.productOptionId === item.productOptionId)

    let updatedItems
    if (exists) {
      updatedItems = currentItems.map((i) =>
        i.productOptionId === item.productOptionId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i,
      )
    } else {
      updatedItems = [...currentItems, item]
    }

    set({ cartItems: updatedItems })
    setGuestCart(updatedItems)
  },

  // 수량 변경
  updateQuantity: (productOptionId, quantity) => {
    const updatedItems = get().cartItems.map((item) =>
      item.productOptionId === productOptionId ? { ...item, quantity } : item,
    )

    set({ cartItems: updatedItems })
    setGuestCart(updatedItems)
  },

  //옵션 변경
  updateOption: (oldOptionId, newOption) => {
    const updatedCart = updateGuestCartOption(oldOptionId, newOption)
    set({ cartItems: updatedCart })
  },

  // 항목 삭제
  removeItem: (productOptionId) => {
    const updatedItems = get().cartItems.filter((item) => item.productOptionId !== productOptionId)

    set({ cartItems: updatedItems })
    setGuestCart(updatedItems)
  },

  // 장바구니 초기화
  clearCart: () => {
    set({ cartItems: [] })
    clearGuestCart()
  },
  setCartItems: (items) => {
    set({ cartItems: items })
    setGuestCart(items)
  },
}))

export default useGuestCartStore
