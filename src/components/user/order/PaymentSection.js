// src/components/user/order/PaymentSection.jsx
import React, { useEffect, useState, useRef } from 'react'
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'
import { CAlert, CSpinner } from '@coreui/react'

const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

export default function PaymentSection({ finalPayment, onPaymentReady }) {
  const [widgets, setWidgets] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isRendered = useRef(false) // 렌더링 여부 추적

  // 1) 토스 페이먼츠 SDK 로드 및 위젯 인스턴스 생성 (최초 1회만)
  useEffect(() => {
    const initPayment = async () => {
      try {
        setLoading(true)
        const tossPayments = await loadTossPayments(CLIENT_KEY)
        const widgetsInstance = tossPayments.widgets({ customerKey: ANONYMOUS })
        setWidgets(widgetsInstance)
        setError(null)
      } catch (err) {
        console.error('토스 페이먼츠 SDK 로드 실패:', err)
        setError('결제 모듈을 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    initPayment()
  }, [])

  // 2) 위젯 인스턴스가 생성되면 UI 렌더링 (최초 1회만)
  useEffect(() => {
    if (!widgets || isRendered.current) return

    const renderPaymentUI = async () => {
      try {
        // 금액 설정 (반드시 먼저 호출)
        await widgets.setAmount({
          currency: 'KRW',
          value: finalPayment,
        })

        // 결제 수단 UI 렌더링 (최초 1회만)
        await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        })

        // 이용약관 UI 렌더링 (최초 1회만)
        await widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        })

        isRendered.current = true // 렌더링 완료 표시

        // 부모 컴포넌트에 widgets 인스턴스 전달
        if (onPaymentReady) {
          onPaymentReady(widgets)
        }
      } catch (err) {
        console.error('결제 UI 렌더링 실패:', err)
        setError('결제 화면을 표시하는 데 실패했습니다.')
      }
    }

    renderPaymentUI()
  }, [widgets])

  // 3) 금액이 변경되면 setAmount만 호출 (재렌더링 X)
  useEffect(() => {
    if (!widgets || !isRendered.current) return

    const updateAmount = async () => {
      try {
        await widgets.setAmount({
          currency: 'KRW',
          value: finalPayment,
        })
      } catch (err) {
        console.error('금액 업데이트 실패:', err)
      }
    }

    updateAmount()
  }, [finalPayment, widgets])

  // 로딩 중
  if (loading) {
    return (
      <div className="text-center py-4">
        <CSpinner color="primary" />
        <p className="mt-2 text-muted">결제 모듈을 불러오는 중...</p>
      </div>
    )
  }

  // 에러 발생
  if (error) {
    return <CAlert color="danger">{error}</CAlert>
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h6 className="fw-semibold mb-3">결제 수단</h6>
      {/* 토스 페이먼츠가 결제 수단 UI를 여기에 렌더링 */}
      <div id="payment-method" style={{ marginBottom: '1rem' }} />

      {/* 토스 페이먼츠가 이용약관 UI를 여기에 렌더링 */}
      <div id="agreement" style={{ marginBottom: '1rem' }} />
    </div>
  )
}
