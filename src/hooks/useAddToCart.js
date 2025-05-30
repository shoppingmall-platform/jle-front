// src/hooks/useAddToCart.js

import { addToCart } from '@/apis/member/cartApis'
import { addToGuestCart, getGuestCart } from '@/utils/guestCartUtils'
import guestCartStore from '@/store/member/guestCartStore'
import { authStore } from '@/store/auth/authStore'

const useAddToCart = () => {
  const isLogin = authStore.getState().isLogin
  const setGuestCartItems = guestCartStore((state) => state.setCartItems)

  /**
   * 장바구니에 상품을 추가합니다 (회원/비회원 모두 처리)
   * @param {Object} options - 추가 옵션
   * @param {Object} options.product - 상품 전체 정보 (비회원용)
   * @param {Object} options.matchedOption - 선택된 옵션 객체
   * @param {number} options.quantity - 수량
   * @param {boolean} [options.skipOptionMatch=false] - 이미 포맷된 newItem을 직접 넘길지 여부
   * @param {Object} [options.rawItem] - 직접 포맷한 newItem (productOptionId, quantity)
   */
  const handleAddToCart = async ({
    product,
    matchedOption,
    quantity,
    skipOptionMatch = false,
    rawItem,
  }) => {
    const item =
      skipOptionMatch && rawItem
        ? rawItem
        : {
            productOptionId: matchedOption.productOptionId,
            quantity,
          }

    if (isLogin()) {
      try {
        await addToCart([item])
        alert('장바구니에 추가되었습니다.')
      } catch (err) {
        console.error('❌ 회원 장바구니 추가 실패:', err)
        alert('장바구니 추가에 실패했습니다.')
      }
    } else {
      const guestItem =
        skipOptionMatch && rawItem
          ? rawItem
          : {
              ...item,
              productInfo: {
                productId: product.productId,
                name: product.name,
                price: product.price,
                discountedPrice: product.discountedPrice,
                thumbnailPath: product.thumbnailPath,
                productOptions: product.productOptions,
              },
            }

      addToGuestCart(guestItem)
      const updatedCart = getGuestCart()
      setGuestCartItems(updatedCart)
      alert('장바구니에 추가되었습니다.')
    }
  }

  return { handleAddToCart }
}

export default useAddToCart
