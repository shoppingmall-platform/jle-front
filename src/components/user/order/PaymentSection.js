// src/components/user/order/PaymentSection.jsx
import React, { useEffect, useState } from 'react'
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'
import { CRow, CCol, CAlert } from '@coreui/react'

const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

export default function PaymentSection({ finalPayment }) {
  const [widgets, setWidgets] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTossPayments(CLIENT_KEY)
      .then((tossPayments) => {
        // customerKey ANONYMOUS for non-logged in
        const w = tossPayments.widgets({ customerKey: ANONYMOUS })
        setWidgets(w)
      })
      .catch((err) => {
        console.error('Toss SDK 로드 실패', err)
        setError('결제 모듈 로드에 실패했습니다.')
      })
  }, [])

  useEffect(() => {
    if (!widgets) return

    // 1) 금액 설정 (반드시 먼저)
    widgets.setAmount({ currency: 'KRW', value: finalPayment })

    // 2) 결제수단 버튼 렌더링
    widgets.renderPaymentMethods({
      selector: '#payment-method',
      variantKey: 'DEFAULT',
    })

    // 3) 약관 렌더링
    widgets.renderAgreement({
      selector: '#agreement',
      variantKey: 'AGREEMENT',
    })
  }, [widgets, finalPayment])

  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <div style={{ padding: '1rem' }}>
      <h6 className="fw-semibold mb-3">결제 방법 선택</h6>
      <div id="payment-method" style={{ marginBottom: '1rem' }} />
      <div id="agreement" style={{ marginBottom: '1rem' }} />
    </div>
  )
}
