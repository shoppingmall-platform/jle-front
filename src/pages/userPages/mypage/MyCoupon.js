import React, { useState } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CCollapse,
  CButton,
  CFormInput,
  CForm,
  CAlert,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const MyCoupon = () => {
  const mockCoupons = [
    {
      memberCouponId: 'c1',
      couponIssueCode: 'ABC123',
      couponName: '10% 할인 쿠폰',
      couponeType: 'PERCENT',
      discountAmount: 10,
      minOrderPrice: 20000,
      maxDiscountPrice: 5000,
      issuedAt: '2025-05-01',
      expiredAt: '2025-06-01',
      comment: '모든 카테고리에서 사용 가능',
      status: 'ACTIVE',
    },
    {
      memberCouponId: 'c2',
      couponIssueCode: 'XYZ789',
      couponName: '5,000원 정액 할인',
      couponeType: 'FIXED',
      discountAmount: 5000,
      minOrderPrice: 30000,
      maxDiscountPrice: null,
      issuedAt: '2025-04-20',
      expiredAt: '2025-05-20',
      comment: '일부 카테고리는 제외됩니다.',
      status: 'EXPIRED',
    },
  ]

  const [visibleDetails, setVisibleDetails] = useState({})
  const [codeInput, setCodeInput] = useState('')
  const [alertMsg, setAlertMsg] = useState(null)
  const [showGuide, setShowGuide] = useState(false)

  const toggleDetails = (id) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    if (!/^[a-zA-Z0-9]{10,35}$/.test(codeInput)) {
      setAlertMsg('올바른 쿠폰 번호를 입력해주세요. (10~35자 영문/숫자)')
    } else {
      setAlertMsg('쿠폰 인증 요청을 보냈습니다! (연동 시 처리)')
      // 실제 인증 API 연동 처리 필요
    }
  }

  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '1000px' }}>
      <h4 className="mb-5">마이 쿠폰</h4>
      <CCard className="mb-5">
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>쿠폰명</CTableHeaderCell>
                <CTableHeaderCell>할인</CTableHeaderCell>
                <CTableHeaderCell>최소주문</CTableHeaderCell>
                <CTableHeaderCell>유효기간</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {mockCoupons.map((coupon) => (
                <React.Fragment key={coupon.memberCouponId}>
                  <CTableRow>
                    <CTableDataCell>{coupon.couponName}</CTableDataCell>

                    <CTableDataCell>
                      {coupon.couponeType === 'PERCENT'
                        ? `${coupon.discountAmount}%`
                        : `${coupon.discountAmount.toLocaleString()}원`}
                    </CTableDataCell>
                    <CTableDataCell>{coupon.minOrderPrice.toLocaleString()}원 이상</CTableDataCell>
                    <CTableDataCell>
                      {coupon.issuedAt} ~ {coupon.expiredAt}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="primary"
                        onClick={() => toggleDetails(coupon.memberCouponId)}
                      >
                        {visibleDetails[coupon.memberCouponId] ? '닫기' : '상세'}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="p-0">
                      <CCollapse visible={visibleDetails[coupon.memberCouponId]}>
                        <div className="p-3 text-start bg-light">
                          <strong>설명:</strong> {coupon.comment || '없음'} <br />
                          <strong>최대 할인금액:</strong>{' '}
                          {coupon.maxDiscountPrice
                            ? `${coupon.maxDiscountPrice.toLocaleString()}원`
                            : '제한 없음'}{' '}
                          <br />
                          <strong>상태:</strong>{' '}
                          {coupon.status === 'ACTIVE'
                            ? '사용 가능'
                            : coupon.status === 'EXPIRED'
                              ? '만료됨'
                              : '삭제됨'}
                        </div>
                      </CCollapse>
                    </CTableDataCell>
                  </CTableRow>
                </React.Fragment>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardBody className="d-flex flex-column align-items-center">
          {/* 왼쪽 정렬을 위한 클래스 추가 */}
          <h6 className="mt-3 mb-3 align-self-start">쿠폰인증번호 등록하기</h6>

          <CForm className="d-flex gap-2 justify-content-center" onSubmit={handleCodeSubmit}>
            <CFormInput
              style={{ maxWidth: '300px' }}
              placeholder="쿠폰번호 입력"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <CButton type="submit" color="dark">
              쿠폰번호인증
            </CButton>
          </CForm>

          <small className="d-block text-center mt-2 text-muted">
            반드시 쇼핑몰에서 발행한 쿠폰번호만 입력해주세요. (10~35자 일련번호 ‘-’ 제외)
          </small>

          {alertMsg && (
            <CAlert color="info" className="mt-3 w-100 text-center">
              {alertMsg}
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {/* 쿠폰 이용 안내 */}
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-start w-100">쿠폰 이용 안내</h6>
            <CButton
              color="link"
              size="sm"
              className="text-decoration-none"
              onClick={() => setShowGuide(!showGuide)}
            >
              {showGuide ? '닫기 ▲' : '펼치기 ▼'}
            </CButton>
          </div>
          <CCollapse visible={showGuide}>
            <CListGroup className="text-start">
              <CListGroupItem>
                1. 쇼핑몰에서 발행한 종이쿠폰/시리얼쿠폰/모바일쿠폰 인증번호 등록 시 온라인쿠폰으로
                발급됩니다.
              </CListGroupItem>
              <CListGroupItem>
                2. 쿠폰은 주문 시 1회에 한해 적용되며, 1회 사용 시 재사용이 불가능합니다.
              </CListGroupItem>
              <CListGroupItem>
                3. 쿠폰은 특정 상품에만 적용될 수 있으며, 구매 시점에 따라 사용 제한이 있을 수
                있습니다.
              </CListGroupItem>
              <CListGroupItem>
                4. 특정한 종이쿠폰/시리얼쿠폰/모바일쿠폰은 1회만 사용 가능합니다.
              </CListGroupItem>
              <CListGroupItem>5. 배송비 할인쿠폰은 '기본배송' 상품에만 적용됩니다.</CListGroupItem>
              <CListGroupItem>
                6. 전체 배송비 할인쿠폰은 '기본배송', '개별배송', '업체배송' 상품에 모두 적용됩니다.
              </CListGroupItem>
            </CListGroup>
          </CCollapse>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default MyCoupon
