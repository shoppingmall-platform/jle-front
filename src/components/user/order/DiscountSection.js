// src/components/order/DiscountSection.jsx
import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

// 더미 쿠폰 데이터: 실제 API 호출 시 교체하세요.
const DUMMY_COUPONS = [
  { couponId: 1, name: '첫구매 쿠폰 (₩3,000 할인)', discountAmount: 3000 },
  { couponId: 2, name: '회원 등급 쿠폰 (₩2,000 할인)', discountAmount: 2000 },
  { couponId: 3, name: '기념일 쿠폰 (₩5,000 할인)', discountAmount: 5000 },
]

const DiscountSection = ({ orderItems = [] }) => {
  // ─────────────────────────────────────────────────────────────
  // 1) 상품별 할인합 계산
  // ─────────────────────────────────────────────────────────────

  // 상품 총 원가 합 (price × quantity)
  const totalOriginalSum = orderItems.reduce((sum, item) => {
    const info = item.productOptionInfo.productInfo
    return sum + (info.price || 0) * (item.quantity || 1)
  }, 0)

  // 상품 총 할인가 합 (discountedPrice × quantity)
  const totalDiscountedSum = orderItems.reduce((sum, item) => {
    const info = item.productOptionInfo.productInfo
    return sum + (info.discountedPrice || 0) * (item.quantity || 1)
  }, 0)

  // 상품별 할인 합계 = (price − discountedPrice) × quantity
  const productDiscountSum = totalOriginalSum - totalDiscountedSum

  const shippingFee = totalDiscountedSum >= 70000 ? 0 : 3000
  // ─────────────────────────────────────────────────────────────
  // 2) 적립금(포인트) 사용 관련 상태
  // ─────────────────────────────────────────────────────────────

  // 예시: 보유 포인트 더미 2,000원 (실제 API 연동 필요)
  const DUMMY_AVAILABLE_POINTS = 2000

  const [availablePoints] = useState(DUMMY_AVAILABLE_POINTS)
  const [usePoints, setUsePoints] = useState(0)

  const handlePointsChange = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, '')
    const num = Number(onlyNums) || 0
    if (num > availablePoints) {
      setUsePoints(availablePoints)
    } else {
      setUsePoints(num)
    }
  }

  const handleUseAllPoints = () => {
    setUsePoints(availablePoints)
  }

  // ─────────────────────────────────────────────────────────────
  // 3) 쿠폰 사용 관련 상태
  // ─────────────────────────────────────────────────────────────

  const [ownedCoupons, setOwnedCoupons] = useState([])
  const [selectedCouponId, setSelectedCouponId] = useState('')
  const [couponError, setCouponError] = useState(null)

  useEffect(() => {
    // 실제 API 호출하여 setOwnedCoupons(response.data) 로 교체 필요
    setOwnedCoupons(DUMMY_COUPONS)
  }, [])

  const handleCouponSelect = (couponIdStr) => {
    setCouponError(null)
    setSelectedCouponId(couponIdStr)

    if (couponIdStr === '') {
      return
    }
    const id = Number(couponIdStr)
    const found = ownedCoupons.find((c) => c.couponId === id)
    if (!found) {
      setCouponError('유효한 쿠폰을 선택해주세요.')
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4) 추가 할인액(쿠폰+포인트) 계산
  // ─────────────────────────────────────────────────────────────

  const [additionalDiscount, setAdditionalDiscount] = useState(0)

  useEffect(() => {
    const couponObj = ownedCoupons.find((c) => c.couponId === Number(selectedCouponId))
    const couponAmt = couponObj ? couponObj.discountAmount : 0
    const pointAmt = usePoints
    setAdditionalDiscount(couponAmt + pointAmt)
  }, [usePoints, selectedCouponId, ownedCoupons])

  // ─────────────────────────────────────────────────────────────
  // 5) 총 할인금액 & 최종 결제금액 계산
  // ─────────────────────────────────────────────────────────────

  const totalDiscount = productDiscountSum + additionalDiscount
  const finalPayment = totalDiscountedSum - additionalDiscount + shippingFee

  return (
    <div style={{ padding: '1rem' }}>
      {/* ───────────── 1) 상품별 할인 요약 ───────────── */}
      <CCard className="mb-4">
        <CCardHeader>상품별 할인 내역</CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol xs={6}>
              <CFormLabel>상품 총 원가</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end">
              {totalOriginalSum.toLocaleString()}원
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol xs={6}>
              <CFormLabel>상품 총 할인가</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end">
              {totalDiscountedSum.toLocaleString()}원
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CFormLabel>상품별 할인 합계</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end" style={{ color: '#d9534f', fontWeight: 'bold' }}>
              {productDiscountSum.toLocaleString()}원
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ───────────── 2) 적립금 + 쿠폰 적용 ───────────── */}
      <CRow className="mb-4">
        {/* 적립금 사용 */}
        <CCol xs={12} md={6}>
          <CFormLabel>적립금 사용</CFormLabel>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <CFormInput
              type="number"
              placeholder="0"
              value={usePoints}
              onChange={(e) => handlePointsChange(e.target.value)}
              style={{ maxWidth: '120px' }}
            />
            <CButton color="outline-dark" onClick={handleUseAllPoints}>
              전액 사용
            </CButton>
          </div>
          <div className="text-muted small" style={{ marginTop: '0.5rem' }}>
            보유 잔액: {availablePoints.toLocaleString()}원
          </div>
        </CCol>

        {/* 쿠폰 선택 */}
        <CCol xs={12} md={6}>
          <CFormLabel>보유 쿠폰</CFormLabel>
          {ownedCoupons.length === 0 ? (
            <div className="text-muted small">사용 가능한 쿠폰이 없습니다.</div>
          ) : (
            <CFormSelect
              value={selectedCouponId}
              onChange={(e) => handleCouponSelect(e.target.value)}
            >
              <option value="">-- 쿠폰 선택 (선택 안 함) --</option>
              {ownedCoupons.map((coupon) => (
                <option key={coupon.couponId} value={coupon.couponId}>
                  {coupon.name} (₩{coupon.discountAmount.toLocaleString()})
                </option>
              ))}
            </CFormSelect>
          )}
          {couponError && (
            <CAlert color="danger" className="mt-2">
              {couponError}
            </CAlert>
          )}
          <div className="text-muted small" style={{ marginTop: '0.5rem' }}>
            보유 쿠폰 개수: {ownedCoupons.length}개
          </div>
        </CCol>
      </CRow>

      {/* ───────────── 3) 최종 결제정보 ───────────── */}
      <CCard>
        <CCardHeader>최종 결제 정보</CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol xs={6}>
              <CFormLabel>할인가 기준 상품 합</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end">
              {totalDiscountedSum.toLocaleString()}원
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol xs={6}>
              <CFormLabel>추가 할인 금액</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end" style={{ color: '#d9534f', fontWeight: 'bold' }}>
              {additionalDiscount.toLocaleString()}원
            </CCol>
          </CRow>
          <hr />
          <CRow className="mb-2">
            <CCol xs={6}>
              <CFormLabel>배송비</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end">
              {shippingFee === 0 ? '0원 (무료배송)' : shippingFee.toLocaleString() + '원'}
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol xs={6}>
              <CFormLabel>결제 예정 금액</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              {finalPayment.toLocaleString()}원
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DiscountSection
