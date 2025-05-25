import api from '@/apis/index'

export const getMyCoupons = async () => {
  try {
    const response = await api.get('/member/v1/coupons')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const issueMyCoupon = async (couponIssueCode) => {
  try {
    const response = await api.get('/member/v1/issue-coupon', { couponIssueCode })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default {
  getMyCoupons,
  issueMyCoupon,
}
