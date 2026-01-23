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
import couponApi from '@/apis/promotion/couponApis'

const DiscountSection = ({ orderItems = [], onDiscountChange }) => {
  // ─────────────────────────────────────────────────────────────
  // 1) 상품별 할인합 계산
  // ─────────────────────────────────────────────────────────────

  // 상품 총 원가 합 ((price + additionalPrice) × quantity)
  const totalOriginalSum = orderItems.reduce((sum, item) => {
    const info = item.productOptionInfo.productInfo
    const option = info.productOptions.find(
      (opt) => opt.productOptionId === item.productOptionInfo.productOptionId,
    )
    const additionalPrice = option?.additionalPrice || 0
    return sum + (info.price + additionalPrice) * (item.quantity || 1)
  }, 0)

  // 상품 총 할인가 합 ((discountedPrice + additionalPrice) × quantity)
  const totalDiscountedSum = orderItems.reduce((sum, item) => {
    const info = item.productOptionInfo.productInfo
    const option = info.productOptions.find(
      (opt) => opt.productOptionId === item.productOptionInfo.productOptionId,
    )
    const additionalPrice = option?.additionalPrice || 0
    return sum + (info.discountedPrice + additionalPrice) * (item.quantity || 1)
  }, 0)

  // 상품별 할인 합계 = (price − discountedPrice) × quantity
  // 주의: additionalPrice는 할인 전후 동일하므로 제외
  const productDiscountSum = totalOriginalSum - totalDiscountedSum

  const shippingFee = totalDiscountedSum >= 70000 ? 0 : 3000
  // ─────────────────────────────────────────────────────────────
  // 2) 쿠폰 사용 관련 상태
  // ─────────────────────────────────────────────────────────────

  const [ownedCoupons, setOwnedCoupons] = useState([])
  const [selectedCouponId, setSelectedCouponId] = useState('')
  const [couponError, setCouponError] = useState(null)
  const [loadingCoupons, setLoadingCoupons] = useState(true)

  useEffect(() => {
    // ✅ 실제 내 쿠폰 조회 API 호출
    const fetchMyCoupons = async () => {
      try {
        setLoadingCoupons(true)
        console.log('🎫 주문 페이지 - 내 쿠폰 조회 중...')
        const coupons = await couponApi.getMyCoupons()
        console.log('🎫 주문 페이지 - 조회된 쿠폰:', coupons)

        // API 응답 형식을 컴포넌트에서 사용하는 형식으로 변환
        const formattedCoupons = (coupons || [])
          .filter((coupon) => coupon.status === 'ACTIVE') // 사용 가능한 쿠폰만
          .map((coupon) => ({
            selectId: coupon.memberCouponId, // select의 value로 사용
            couponId: coupon.couponId, // 실제 쿠폰 ID (백엔드로 전송)
            memberCouponId: coupon.memberCouponId,
            name: formatCouponName(coupon),
            discountAmount: calculateDiscountAmount(coupon, totalDiscountedSum),
            couponType: coupon.couponType,
            originalDiscountAmount: coupon.discountAmount,
            maxDiscountPrice: coupon.maxDiscountPrice,
            minOrderPrice: coupon.minOrderPrice,
          }))

        console.log('🎫 변환된 쿠폰 데이터:', formattedCoupons)
        setOwnedCoupons(formattedCoupons)
      } catch (error) {
        console.error('❌ 쿠폰 조회 실패:', error)
        setCouponError('쿠폰을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoadingCoupons(false)
      }
    }

    fetchMyCoupons()
  }, [totalDiscountedSum])

  // 쿠폰 이름 포맷팅
  const formatCouponName = (coupon) => {
    if (coupon.couponType === 'RATE') {
      return `${coupon.couponName} (${coupon.discountAmount}% 할인)`
    } else {
      return `${coupon.couponName} (₩${coupon.discountAmount.toLocaleString()} 할인)`
    }
  }

  // 실제 할인 금액 계산
  const calculateDiscountAmount = (coupon, orderAmount) => {
    // 최소 주문금액 체크
    if (orderAmount < coupon.minOrderPrice) {
      return 0
    }

    if (coupon.couponType === 'RATE') {
      // 할인율 쿠폰
      const discount = Math.floor(orderAmount * (coupon.discountAmount / 100))
      // 최대 할인금액 제한
      if (coupon.maxDiscountPrice > 0) {
        return Math.min(discount, coupon.maxDiscountPrice)
      }
      return discount
    } else {
      // 정액 할인 쿠폰
      // ⚠️ 쿠폰 할인액이 상품 금액을 초과할 수 없음 (배송비는 쿠폰 적용 대상 아님!)
      return Math.min(coupon.discountAmount, orderAmount)
    }
  }

  const handleCouponSelect = (couponIdStr) => {
    setCouponError(null)
    setSelectedCouponId(couponIdStr)

    if (couponIdStr === '') {
      return
    }
    const id = Number(couponIdStr)
    const found = ownedCoupons.find((c) => c.selectId === id)
    if (!found) {
      setCouponError('유효한 쿠폰을 선택해주세요.')
    } else if (totalDiscountedSum < found.minOrderPrice) {
      setCouponError(
        `이 쿠폰은 ${found.minOrderPrice.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
      )
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3) 추가 할인액(쿠폰) 계산
  // ─────────────────────────────────────────────────────────────

  const [additionalDiscount, setAdditionalDiscount] = useState(0)

  useEffect(() => {
    const couponObj = ownedCoupons.find((c) => c.selectId === Number(selectedCouponId))
    const couponAmt = couponObj ? couponObj.discountAmount : 0
    setAdditionalDiscount(couponAmt)

    // 부모 컴포넌트에 쿠폰 ID (실제 couponId), 추가 할인액 전달
    if (onDiscountChange) {
      onDiscountChange({
        couponId: couponObj ? couponObj.couponId : 0, // ← 실제 쿠폰 ID
        memberCouponId: couponObj ? couponObj.memberCouponId : 0,
        points: 0, // 적립금 사용 안 함
        additionalDiscount: couponAmt,
      })
    }
  }, [selectedCouponId, ownedCoupons])

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

      {/* ───────────── 2) 쿠폰 적용 ───────────── */}
      <CCard className="mb-4">
        <CCardHeader>쿠폰 선택</CCardHeader>
        <CCardBody>
          <CFormLabel>보유 쿠폰</CFormLabel>
          {loadingCoupons ? (
            <div className="text-muted small">쿠폰 불러오는 중...</div>
          ) : ownedCoupons.length === 0 ? (
            <div className="text-muted small">사용 가능한 쿠폰이 없습니다.</div>
          ) : (
            <CFormSelect
              value={selectedCouponId}
              onChange={(e) => handleCouponSelect(e.target.value)}
            >
              <option value="">-- 쿠폰 선택 (선택 안 함) --</option>
              {ownedCoupons.map((coupon) => (
                <option
                  key={coupon.selectId}
                  value={coupon.selectId}
                  disabled={totalDiscountedSum < coupon.minOrderPrice}
                >
                  {coupon.name}
                  {totalDiscountedSum < coupon.minOrderPrice &&
                    ` (최소 ${coupon.minOrderPrice.toLocaleString()}원 이상)`}
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
        </CCardBody>
      </CCard>

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
              <CFormLabel>쿠폰 할인</CFormLabel>
            </CCol>
            <CCol xs={6} className="text-end" style={{ color: '#d9534f', fontWeight: 'bold' }}>
              {additionalDiscount > 0 ? `-${additionalDiscount.toLocaleString()}원` : '0원'}
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
