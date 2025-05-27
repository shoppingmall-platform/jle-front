// ✅ CartApis.js
import { useApi } from '@/apis/index'
const api = useApi()

// 장바구니 추가 API
export const addToCart = async (cartItems) => {
  try {
    const response = await api.post('/member/v1/members/cart', cartItems, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Cookie: at=액세스토큰 포함 위해 필요
    })
    console.log('✅ 장바구니 추가 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 장바구니 추가 실패:', error)
    throw error
  }
}
// ✅ 장바구니 조회 API
export const getCartItems = async () => {
  try {
    const response = await api.get('/member/v1/members/cart', {
      withCredentials: true,
    })
    console.log('📦 장바구니 조회 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('📛 장바구니 조회 실패:', error)
    throw error
  }
}
// ✅ 장바구니 옵션/수량 변경 API 추가
export const updateCartItem = async (updatePayload) => {
  try {
    const response = await api.post('/member/v1/members/cart/option-update', updatePayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    console.log('✅ 장바구니 변경 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 장바구니 변경 실패:', error)
    throw error
  }
}

// ✅ 장바구니 삭제 API
export const deleteCartItems = async (cartItemIds) => {
  try {
    const response = await api.post('/member/v1/members/cart/delete', cartItemIds, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    console.log('🗑️ 장바구니 삭제 성공')
    return response.status
  } catch (error) {
    console.error('❌ 장바구니 삭제 실패:', error)
    throw error
  }
}

export default {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItems,
}
