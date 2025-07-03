// src/pages/Order.js
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CContainer,
  CAccordion,
  CAccordionItem,
  CFormLabel,
  CAccordionHeader,
  CAccordionBody,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { getCartItems } from '@/apis/member/cartApis'
import AddressSection from '@/components/user/order/AddressSection'
import OrderItemsSection from '@/components/user/order/OrderItemsSection'
import DiscountSection from '@/components/user/order/DiscountSection'
import PaymentSection from '@/components/user/order/PaymentSection'

// 표준.js 로 로드된 전역 모듈
const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
let tossInstance

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Order = () => {
  const navigate = useNavigate()
  const query = useQuery()

  // URL 쿼리로 “cartItems=11,10,8” 같은 식으로 넘어왔다고 가정
  const cartItemsParam = query.get('cartItems') || ''
  const selectedIds = cartItemsParam
    .split(',')
    .map((v) => Number(v))
    .filter((v) => !isNaN(v))

  // 1) 상위에서 한 번만 가져올 “orderItems” 상태
  const [orderItems, setOrderItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [itemsError, setItemsError] = useState(null)

  // 2) “상품별 할인합” 상태 (원가 – 할인가 합)
  const [itemsDiscountSum, setItemsDiscountSum] = useState(0)

  // 3) “추가 할인(적립금+쿠폰)” 상태
  const [additionalDiscountSum, setAdditionalDiscountSum] = useState(0)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [cardCompany, setCardCompany] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoadingItems(true)
      setItemsError(null)
      try {
        const data = await getCartItems()
        // API에서 { cartItems: [ {...}, {...}, ... ] } 형태로 옴
        const allCartItems = data.cartItems || []

        // “Order 페이지로 넘어올 때 쿼리로 넘어온 cartItemId 목록”에 해당하는 아이템만 필터링
        const filtered = allCartItems.filter((item) => selectedIds.includes(item.cartItemId))
        setOrderItems(filtered)

        // 상품별 할인합 계산: Σ[(price – discountedPrice) × quantity]
        const sumDiscount = filtered.reduce((sum, item) => {
          const info = item.productOptionInfo.productInfo
          const original = info.price || 0
          const discounted = info.discountedPrice || 0
          const qty = item.quantity || 1
          return sum + (original - discounted) * qty
        }, 0)
        setItemsDiscountSum(sumDiscount)
      } catch (err) {
        console.error('장바구니 조회 실패:', err)
        if (err.response && err.response.status === 401) {
          setItemsError('로그인이 필요합니다. 로그인 페이지로 이동합니다.')
        } else {
          setItemsError('주문 상품 정보를 불러오는 데 실패했습니다.')
        }
      } finally {
        setLoadingItems(false)
      }
    }

    if (selectedIds.length > 0) {
      fetch()
    } else {
      // 선택된 아이디가 없으면 빈 배열
      setOrderItems([])
      setItemsDiscountSum(0)
      setLoadingItems(false)
    }
  }, [cartItemsParam])

  // 0. 페이먼트 모듈 초기화
  useEffect(() => {
    if (window.TossPayments && !tossInstance) {
      tossInstance = window.TossPayments(CLIENT_KEY)
    }
  }, [])

  // (부모가 “추가 할인액”을 받는 콜백)
  const handleAdditionalDiscountChange = (sum) => {
    setAdditionalDiscountSum(sum)
  }

  // “상품별 할인합 + 추가 할인합” = 최종 할인금액
  const totalDiscount = itemsDiscountSum + additionalDiscountSum

  // 만약 비로그인 상태로 401 에러가 났다면, 로그인 유도
  if (itemsError === '로그인이 필요합니다. 로그인 페이지로 이동합니다.') {
    return (
      <div className="text-center py-5">
        <CAlert color="warning">{itemsError}</CAlert>
        <CButton color="primary" onClick={() => navigate('/login')}>
          로그인하러 가기
        </CButton>
      </div>
    )
  }

  if (loadingItems) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (orderItems.length === 0) {
    return (
      <div className="text-center mt-5">
        <h5>주문할 상품이 없습니다.</h5>
      </div>
    )
  }

  // ① 원래 금액 = Σ[원가(price) × quantity]
  const originalSum = orderItems.reduce((sum, item) => {
    const info = item.productOptionInfo.productInfo
    return sum + (info.price || 0) * (item.quantity || 1)
  }, 0)

  // ② 할인가 합 = Σ[할인가(discountedPrice) × quantity]
  const discountedSum = orderItems.reduce((sum, item) => {
    const info = item.productOptionInfo.productInfo
    return sum + (info.discountedPrice || 0) * (item.quantity || 1)
  }, 0)

  // ③ 배송비: 할인가 합 기준 70,000원 이상이면 0원, 아니면 3,000원
  const shippingFee = discountedSum >= 70000 ? 0 : 3000

  // ④ 최종 결제금액 = (할인가 합) – (추가 할인합) + 배송비
  const finalPayment = discountedSum - additionalDiscountSum + shippingFee

  const estimatedPoints = Math.floor(discountedSum * 0.01)

  // 5. 최종 결제 요청 함수
  const handleFinalPayment = () => {
    if (!tossInstance) {
      alert('결제 모듈을 불러올 수 없습니다.')
      return
    }
    if (!selectedPaymentMethod) {
      alert('결제 수단을 선택해주세요.')
      return
    }
    // 주문번호는 백엔드와 동기 맞추실 때, 실제 orderId를 사용하세요.
    const orderId = `order-${Date.now()}`
    tossInstance.requestPayment(
      {
        method: selectedPaymentMethod, // e.g. 'card', '카카오페이' 등
        amount: finalPayment, // 최종 결제 금액
        orderId,
        orderName: 'JLE 쇼핑몰 주문',
        successUrl: `${window.location.origin}/order/success?paymentKey={{paymentKey}}&orderId=${orderId}&amount=${finalPayment}`,
        failUrl: `${window.location.origin}/order/fail?code={{code}}&message={{message}}`,
      },
      (error) => {
        console.error('결제 요청 실패', error)
        alert('결제 요청에 실패했습니다.')
      },
    )
  }

  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h4 className="mb-4 text-center">주문/결제</h4>

      <CAccordion alwaysOpen activeItemKey={['0']}>
        {/* 1. 배송지 */}
        <CAccordionItem itemKey="0">
          <CAccordionHeader>배송지</CAccordionHeader>
          <CAccordionBody>
            <AddressSection />
          </CAccordionBody>
        </CAccordionItem>

        {/* 2. 주문상품  */}
        <CAccordionItem itemKey="1">
          <CAccordionHeader>주문상품</CAccordionHeader>
          <CAccordionBody>
            <OrderItemsSection
              orderItems={orderItems}
              onItemsDiscountChange={setItemsDiscountSum}
            />
          </CAccordionBody>
        </CAccordionItem>

        {/* 3. 할인/부가결제 */}
        <CAccordionItem itemKey="2">
          <CAccordionHeader>할인/부가결제</CAccordionHeader>
          <CAccordionBody>
            <DiscountSection
              orderItems={orderItems}
              onTotalDiscountChange={handleAdditionalDiscountChange}
            />
          </CAccordionBody>
        </CAccordionItem>

        {/* 4. 결제수단 */}
        <CAccordionItem itemKey="3">
          <CAccordionHeader>결제수단</CAccordionHeader>
          <CAccordionBody>
            <PaymentSection
              finalPayment={finalPayment}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              cardCompany={cardCompany}
              setCardCompany={setCardCompany}
            />
          </CAccordionBody>
        </CAccordionItem>

        {/* 5. 적립 혜택 (추후 구현) */}
        <CAccordionItem itemKey="5">
          <CAccordionHeader>적립 혜택</CAccordionHeader>
          <CAccordionBody>
            <div style={{ padding: '1rem' }}>
              <CFormLabel className="fw-semibold">적립 예정 금액</CFormLabel>{' '}
              <div className="mt-2">{estimatedPoints.toLocaleString()}원</div>{' '}
              <div className="text-muted small mt-1">(할인가 합의 1%를 포인트로 적립)</div>{' '}
            </div>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>

      {/*  화면 하단에 “총 할인금액”과 “결제하기 버튼”  */}
      <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #ddd' }}>
        <div className="d-flex justify-content-between mb-3">
          <span>원래 금액</span>
          <span>{originalSum.toLocaleString()}원</span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span>총 할인금액</span>
          <span style={{ color: '#d9534f', fontWeight: 'bold' }}>
            {totalDiscount.toLocaleString()}원
          </span>
        </div>
        <hr />
        <div className="d-flex justify-content-between mb-4">
          <span>최종 결제금액</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {finalPayment.toLocaleString()}원
          </span>
        </div>

        <div className="text-center">
          <CButton color="dark" size="lg" onClick={handleFinalPayment}>
            결제하기
          </CButton>
        </div>
      </div>
    </CContainer>
  )
}

export default Order
