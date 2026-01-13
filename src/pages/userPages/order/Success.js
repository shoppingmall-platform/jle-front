// src/pages/userPages/order/Success.js
import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { confirmPayment } from '@/apis/order/orderApis'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CImage,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'

export function SuccessPage() {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // URL 파라미터에서 가져오기
  // Widgets SDK는 successUrl에 자동으로 paymentKey를 추가해줌
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const paymentKey = searchParams.get('paymentKey')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirm() {
    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      setError('결제 정보가 올바르지 않습니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 백엔드로 결제 승인 요청
      await confirmPayment({
        paymentKey,
        orderId,
        amount: Number(amount),
      })
      setIsConfirmed(true)
    } catch (err) {
      console.error('결제 승인 실패:', err)
      setError('결제 승인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex-column align-center w-100"
      style={{
        display: 'flex',
        padding: '2rem 1rem',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {isConfirmed ? (
        // 결제 승인 완료 화면
        <CCard className="text-center">
          <CCardHeader>✅ 결제가 완료되었습니다</CCardHeader>
          <CCardBody>
            <CImage
              src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
              width="120"
              height="120"
              alt="결제 완료"
              style={{ margin: '1rem 0' }}
            />
            <CRow className="mb-2">
              <CCol xs={6}>결제 금액</CCol>
              <CCol xs={6} className="text-end">
                {Number(amount).toLocaleString()}원
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol xs={6}>주문 번호</CCol>
              <CCol xs={6} className="text-end">
                {orderId}
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol xs={6}>paymentKey</CCol>
              <CCol
                xs={6}
                className="text-end"
                style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}
              >
                {paymentKey}
              </CCol>
            </CRow>
            <div className="d-flex gap-2 justify-content-center">
              <CButton color="primary" onClick={() => navigate('/')}>
                메인으로
              </CButton>
              <CButton
                color="secondary"
                onClick={() => window.open('https://developers.tosspayments.com/sandbox')}
              >
                더 테스트하기
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        // 결제 승인 대기 화면
        <div className="text-center">
          <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          <h2 className="mt-3">결제 요청에 성공했습니다</h2>
          <p className="text-muted">아래 버튼을 눌러 결제 승인을 진행해주세요.</p>

          {error && (
            <CAlert color="danger" className="mt-3">
              {error}
            </CAlert>
          )}

          <CButton
            color="dark"
            size="lg"
            className="mt-3"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                승인 중…
              </>
            ) : (
              '결제 승인하기'
            )}
          </CButton>
        </div>
      )}
    </div>
  )
}

export default SuccessPage
