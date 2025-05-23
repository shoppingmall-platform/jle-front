import api from '@/apis/index'

export const registerCoupon = async (newCoupon) => {
  try {
    const response = await api.post('/member/v1/coupons', newCoupon, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('✅ 쿠폰 등록 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 쿠폰 등록 실패:', error)
    throw error
  }
}

export const getCouponList = async (params) => {
  try {
    const response = await api.post('/member/v1/coupons-read', params, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('📥 쿠폰 조회 결과:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 쿠폰 조회 실패:', error)
    return []
  }
}

export const deleteCoupon = async (couponId) => {
  try {
    const response = await api.post('/member/v1/coupons/delete', { couponId })
    console.log('🗑️ 쿠폰 삭제 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 쿠폰 삭제 실패:', error)
    throw error
  }
}

export default { getCouponList, registerCoupon, deleteCoupon }
