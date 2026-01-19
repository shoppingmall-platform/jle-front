// src/pages/Order.js
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CFormLabel,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { getCartItems } from '@/apis/member/cartApis'
import { createOrder } from '@/apis/order/orderApis'
import AddressSection from '@/components/user/order/AddressSection'
import OrderItemsSection from '@/components/user/order/OrderItemsSection'
import DiscountSection from '@/components/user/order/DiscountSection'
import PaymentSection from '@/components/user/order/PaymentSection'

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

  // 4) 결제 위젯 인스턴스 (PaymentSection에서 받아옴)
  const [paymentWidgets, setPaymentWidgets] = useState(null)
  // 5) 선택된 배송지 정보
  const [selectedAddress, setSelectedAddress] = useState(null)

  // 6) 쿠폰 및 포인트 정보
  const [discountInfo, setDiscountInfo] = useState({
    couponId: 0,
    memberCouponId: 0,
    points: 0,
    additionalDiscount: 0,
  })

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

  // (부모가 “추가 할인액”을 받는 콜백)
  // (부모가 할인 정보를 받는 콜백)
  const handleDiscountChange = (data) => {
    setDiscountInfo(data)
    setAdditionalDiscountSum(data.additionalDiscount)
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
  const handleFinalPayment = async () => {
    if (!paymentWidgets) {
      alert('결제 모듈을 불러올 수 없습니다.')
      return
    }

    // 배송지 선택 확인
    if (!selectedAddress) {
      alert('배송지를 선택해주세요.')
      return
    }

    try {
      // 1. 주문 생성 API 호출
      const orderData = {
        addressInfo: {
          receiver: selectedAddress.receiverName,
          address1: selectedAddress.address1,
          address2: selectedAddress.address2 || '',
          postalCode: selectedAddress.zipcode,
          phoneNumber: selectedAddress.phoneNumber,
          email: 'user@example.com', // TODO: 실제 사용자 이메일로 교체 필요
        },
        items: orderItems.map((item) => ({
          cartItemId: item.cartItemId,
          productId: item.productOptionInfo.productInfo.productId,
          productOptionId: item.productOptionInfo.productOptionId,
          quantity: item.quantity,
        })),
        paymentMethod: '카드', // TODO: PaymentSection에서 선택한 결제수단으로 교체 필요
        orderDiscount: {
          couponId: discountInfo.couponId || null, // ← 실제 쿠폰 ID
          points: discountInfo.points,
        },
        orderDetail: {
          originalTotal: originalSum,
          discountedTotal: discountedSum,
          productDiscount: itemsDiscountSum,
          additionalDiscount: additionalDiscountSum,
          shippingFee: shippingFee,
          finalAmount: finalPayment,
        },
      }

      console.log('📦 주문 생성 요청:', orderData)
      const orderResponse = await createOrder(orderData)
      console.log('✅ 주문 생성 성공:', orderResponse)

      // 백엔드 응답에서 주문번호 추출 (orderId 또는 orderNumber)
      const orderNumber =
        orderResponse.orderId || orderResponse.orderNumber || orderResponse.data?.orderNumber

      if (!orderNumber) {
        throw new Error('주문번호를 받지 못했습니다.')
      }

      // 2. 토스 페이먼츠 결제 요청
      await paymentWidgets.requestPayment({
        orderId: orderNumber, // 백엔드에서 받은 실제 주문번호
        orderName: 'JLE 쇼핑몰 주문',
        successUrl: `${window.location.origin}/order/success?orderId=${orderNumber}&amount=${finalPayment}`,
        failUrl: `${window.location.origin}/order/fail`,
      })
    } catch (error) {
      console.error('주문/결제 실패:', error)
      alert('주문 생성에 실패했습니다: ' + error.message)
    }
  }

  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h4 className="mb-4 text-center">주문/결제</h4>

      {/* 1. 배송지 */}
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">배송지</CCardHeader>
        <CCardBody>
          <AddressSection onAddressSelected={setSelectedAddress} />
        </CCardBody>
      </CCard>

      {/* 2. 주문상품 */}
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">주문상품</CCardHeader>
        <CCardBody>
          <OrderItemsSection orderItems={orderItems} onItemsDiscountChange={setItemsDiscountSum} />
        </CCardBody>
      </CCard>

      {/* 3. 할인/부가결제 */}
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">할인/부가결제</CCardHeader>
        <CCardBody>
          <DiscountSection orderItems={orderItems} onDiscountChange={handleDiscountChange} />
        </CCardBody>
      </CCard>

      {/* 4. 결제수단 */}
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">결제수단</CCardHeader>
        <CCardBody>
          <PaymentSection finalPayment={finalPayment} onPaymentReady={setPaymentWidgets} />
        </CCardBody>
      </CCard>

      {/* 5. 적립 혜택 */}
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">적립 혜택</CCardHeader>
        <CCardBody>
          <div style={{ padding: '1rem' }}>
            <CFormLabel className="fw-semibold">적립 예정 금액</CFormLabel>{' '}
            <div className="mt-2">{estimatedPoints.toLocaleString()}원</div>{' '}
            <div className="text-muted small mt-1">(할인가 합의 1%를 포인트로 적립)</div>{' '}
          </div>
        </CCardBody>
      </CCard>

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
