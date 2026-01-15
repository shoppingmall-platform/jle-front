// src/apis/order/orderApis.js
import { useApi } from '@/apis/index'
const api = useApi()

// ✅ 주문 생성 API - useApi 사용
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/product/v1/orders', orderData)
    console.log('✅ 주문 생성 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 생성 실패:', error)
    throw error
  }
}

// ✅ 결제 승인 API - useApi 사용
export const confirmPayment = async ({ paymentKey, orderId, amount }) => {
  try {
    const response = await api.post('/sandbox-dev/api/v1/payments/confirm', {
      paymentKey,
      orderId,
      amount,
    })
    console.log('✅ 결제 승인 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 결제 승인 실패:', error)
    throw error
  }
}

// ✅ 주문 목록 조회 (관리자)
export const getOrderList = async (conditions = {}) => {
  try {
    const response = await api.post('/order/v1/orders/read', conditions)
    console.log('✅ 주문 목록 조회 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 목록 조회 실패:', error)
    throw error
  }
}

// ✅ 주문 상세 조회
export const getOrderDetail = async (orderId) => {
  try {
    const response = await api.get(`/api/v1/orders/${orderId}`)
    console.log('✅ 주문 상세 조회 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 상세 조회 실패:', error)
    throw error
  }
}

// ✅ 주문 상태 변경 (관리자)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.post(`/order/v1/orders/${orderId}/status`, { status })
    console.log('✅ 주문 상태 변경 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 상태 변경 실패:', error)
    throw error
  }
}

export default {
  createOrder,
  confirmPayment,
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
}
