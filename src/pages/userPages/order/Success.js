// src/pages/userPages/order/Success.js
import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { confirmPayment, confirmPaymentTest } from '@/apis/order/orderApis'
import { CButton, CCard, CCardBody, CAlert, CSpinner, CRow, CCol } from '@coreui/react'

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
      await confirmPaymentTest({
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
        padding: '3rem 1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {isConfirmed ? (
        // 결제 승인 완료 화면
        <CCard className="text-center shadow-lg border-0">
          <CCardBody className="p-5">
            {/* 성공 아이콘 */}
            <div
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
              }}
            >
              <span style={{ fontSize: '4rem', color: 'white' }}>✓</span>
            </div>

            {/* 타이틀 */}
            <h2 className="mb-3" style={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
              주문이 완료되었습니다!
            </h2>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              주문해주셔서 감사합니다.
            </p>

            {/* 주문 정보 박스 */}
            <div
              className="mb-4 p-4"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef',
              }}
            >
              <CRow className="mb-3 align-items-center">
                <CCol xs={5} className="text-start">
                  <strong style={{ color: '#6c757d' }}>주문번호</strong>
                </CCol>
                <CCol xs={7} className="text-end">
                  <span style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{orderId}</span>
                </CCol>
              </CRow>
              <hr style={{ margin: '1rem 0', borderColor: '#dee2e6' }} />
              <CRow className="align-items-center">
                <CCol xs={5} className="text-start">
                  <strong style={{ color: '#6c757d' }}>결제금액</strong>
                </CCol>
                <CCol xs={7} className="text-end">
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#212529' }}>
                    {Number(amount).toLocaleString()}원
                  </span>
                </CCol>
              </CRow>
            </div>

            {/* 안내 메시지 */}
            <div
              className="mb-4 p-3"
              style={{
                backgroundColor: '#e7f3ff',
                borderRadius: '8px',
                border: '1px solid #b3d9ff',
              }}
            >
              <small style={{ color: '#0056b3', lineHeight: '1.6' }}>
                📧 주문 확인 메일이 발송되었습니다.
                <br />
                🚚 배송은 영업일 기준 2-3일 소요됩니다.
              </small>
            </div>

            {/* 버튼 그룹 */}
            <div className="d-flex flex-column gap-3">
              <CButton
                color="dark"
                size="lg"
                onClick={() => navigate('/mypage/orders')}
                style={{
                  padding: '14px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                }}
              >
                주문 내역 확인하기
              </CButton>
              <CButton
                color="light"
                size="lg"
                onClick={() => navigate('/')}
                style={{
                  padding: '14px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: '2px solid #dee2e6',
                }}
              >
                쇼핑 계속하기
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        // 결제 승인 대기 화면
        <CCard className="text-center shadow-lg border-0">
          <CCardBody className="p-5">
            {/* 로딩 스피너 */}
            <div style={{ margin: '2rem 0' }}>
              <CSpinner
                color="primary"
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderWidth: '4px',
                }}
              />
            </div>

            {/* 타이틀 */}
            <h2 className="mb-3" style={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
              결제 처리 중입니다
            </h2>
            <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
              잠시만 기다려주세요.
              <br />
              결제 승인을 진행하고 있습니다.
            </p>

            {/* 에러 메시지 */}
            {error && (
              <CAlert color="danger" className="mb-4">
                <strong>⚠️ 오류 발생</strong>
                <br />
                {error}
              </CAlert>
            )}

            {/* 승인 버튼 */}
            <CButton
              color="dark"
              size="lg"
              className="mt-3"
              onClick={handleConfirm}
              disabled={loading}
              style={{
                padding: '14px 40px',
                fontWeight: 'bold',
                borderRadius: '8px',
                minWidth: '200px',
              }}
            >
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  승인 처리 중...
                </>
              ) : (
                '결제 승인하기'
              )}
            </CButton>
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default SuccessPage
