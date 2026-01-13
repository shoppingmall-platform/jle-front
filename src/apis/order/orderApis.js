// src/apis/order/orderApis.js

// 주문 생성 API
export async function createOrder(orderData) {
  const res = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Cookie 포함
    body: JSON.stringify(orderData),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || '주문 생성 실패')
  }
  return res.json()
}

// 결제 승인 API
export async function confirmPayment({ paymentKey, orderId, amount }) {
  const res = await fetch('/sandbox-dev/api/v1/payments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })
  if (!res.ok) throw new Error('결제 승인 실패')
  return res.json()
}
