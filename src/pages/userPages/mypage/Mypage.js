import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CProgress,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import '@/pages/userPages/userpage.css'
const Mypage = () => {
  const navigate = useNavigate()
  const menuItems = [
    {
      key: 'ORDER',
      title: '주문내역',
      description: '고객님께서 주문하신 상품의 주문 내역을 확인할 수 있습니다.',
      path: '/mypage/orders',
    },
    {
      key: 'WISHLIST',
      title: '관심상품',
      description: '찜한 상품 목록을 확인할 수 있습니다.',
      path: '/mypage/wishlist',
    },
    {
      key: 'PROFILE',
      title: '회원정보',
      description: '회원정보 및 배송지를 수정할 수 있습니다.',
      path: '/mypage/profile',
    },
    {
      key: 'SETTINGS',
      title: '설정',
      description: '알림 및 보안 설정을 변경할 수 있습니다.',
      path: '/mypage/settings',
    },
    {
      key: 'COUPON',
      title: '쿠폰',
      description: '보유하고 있는 쿠폰 내역을 확인할 수 있습니다.',
      path: '/mypage/coupon',
    },
    {
      key: 'ADDRESS',
      title: '주소록 관리',
      description: '자주 사용하는 주소록을 등록하고 관리할 수 있습니다.',
      path: '/mypage/address',
    },
  ]

  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '1000px' }}>
      <h4 className="mb-5">마이페이지</h4>
      <CCard className="mb-4" style={{ minHeight: '150px' }}>
        적립금
      </CCard>
      <CCard className="mb-4" style={{ minHeight: '150px' }}>
        주문처리 현황
      </CCard>
      <CRow className="g-3">
        {menuItems.map((item) => (
          <CCol key={item.key} xs={6} md={3}>
            <CCard className="user-card" onClick={() => navigate(item.path)}>
              <CCardBody className="d-flex flex-column justify-content-center align-items-center">
                <h6>{item.title}</h6>
                <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
                  {item.description}
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  )
}

export default Mypage
