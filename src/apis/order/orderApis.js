// src/apis/orderApis.js
export async function confirmPayment({ paymentKey, orderId, amount }) {
  const res = await fetch('/sandbox-dev/api/v1/payments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })
  if (!res.ok) throw new Error('결제 승인 실패')
  return res.json()
}
