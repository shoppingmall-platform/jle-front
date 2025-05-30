import { React, useEffect } from 'react'
import { CContainer } from '@coreui/react'
import MemberCartList from '@/pages/userPages/cart/MemberCartList'
import GuestCartList from '@/pages/userPages/cart/GuestCartList'
import { authStore } from '@/store/auth/authStore' // ✅ 올바른 방식으로 import

const Cart = () => {
  const isLogin = authStore((state) => state.isLogin()) // ✅ 상태값 subscribe
  useEffect(() => {
    console.log('🧾 로그인 상태:', isLogin ? '회원' : '비회원')
  }, [isLogin])
  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '1100px' }}>
      <h4 className="mb-4 text-center">장바구니</h4>

      {isLogin ? <MemberCartList /> : <GuestCartList />}
    </CContainer>
  )
}
export default Cart
