import { useApi } from '@/apis/index'
const api = useApi()

// ===== 사용자용 API =====

// 주문 생성 API
export const createOrder = async (orderData) => {
  try {
    console.log('📦 주문 API 호출 시작:', orderData)
    const response = await api.post('/product/v1/orders', orderData)
    console.log('✅ 주문 생성 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 생성 실패:', error)
    throw error
  }
}

// 결제 승인 API
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

// 내 주문 목록 조회
export const getMyOrders = async (params) => {
  try {
    console.log('🔍 내 주문 목록 조회 요청:', params)

    const response = await api.post('/order/v1/orders/search', params)
    console.log('✅ 내 주문 목록 조회 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 내 주문 목록 조회 실패:', error)
    throw error
  }
}

// 내 주문 상세 조회
export const getMyOrderDetail = async (orderId) => {
  try {
    const response = await api.get(`/order/v1/orders/${orderId}`)
    console.log('✅ 내 주문 상세 조회 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 내 주문 상세 조회 실패:', error)
    throw error
  }
}

// 주문 취소 (사용자)
export const cancelOrder = async (orderId) => {
  try {
    console.log('🚫 주문 취소 요청:', orderId)
    const response = await api.delete(`/order/v1/orders/${orderId}`)
    console.log('✅ 주문 취소 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 취소 실패:', error)
    throw error
  }
}
// ===== 관리자용 API =====

// 전체 주문 목록 조회 (관리자)
export const getAllOrders = async (
  conditions = {},
  pageable = { page: 0, size: 10, sort: ['orderDate', 'desc'] },
) => {
  try {
    console.log('🔍 전체 주문 조회 요청:', { conditions, pageable })

    const requestBody = {
      conditions: {
        orderId: conditions.orderId || undefined,
        orderMemberName: conditions.orderMemberName || undefined,
        orderMemberId: conditions.orderMemberId || undefined,
        orderProductName: conditions.orderProductName || undefined,
        type: conditions.type || '전체',
        status: conditions.status || '전체',
        startDate: conditions.startDate || undefined,
        endDate: conditions.endDate || undefined,
      },
      pageable: {
        page: pageable.page || 0,
        size: pageable.size || 10,
        sort: pageable.sort || ['orderDate', 'desc'],
      },
    }

    const response = await api.post('/order/v1/admin/orders/search', requestBody)
    console.log('✅ 전체 주문 조회 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 전체 주문 조회 실패:', error)
    throw error
  }
}

// 주문 상세 조회 (관리자)
export const getOrderDetail = async (orderId) => {
  try {
    console.log('🔍 주문 상세 조회 요청:', orderId)
    const response = await api.get(`/order/v1/admin/orders/${orderId}`)
    console.log('✅ 주문 상세 조회 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 상세 조회 실패:', error)
    throw error
  }
}

// 주문 상태 변경 (관리자)
export const updateOrderStatus = async (orderId, orderStatus) => {
  try {
    console.log('🔄 주문 상태 변경 요청:', { orderId, orderStatus })
    const response = await api.post(`/order/v1/admin/orders/status`, {
      orderId,
      orderStatus,
    })
    console.log('✅ 주문 상태 변경 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 주문 상태 변경 실패:', error)
    throw error
  }
}

export default {
  // 사용자용
  createOrder,
  confirmPayment,
  getMyOrders,
  getMyOrderDetail,

  // 관리자용
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
}
