import { Link } from 'react-router-dom'
import { CContainer, CRow, CCol, CInputGroup, CFormInput, CButton, CFooter } from '@coreui/react'

const UserFooter = () => {
  return (
    <CFooter className="bg-light mt-5 border-top">
      <CContainer className="py-5">
        <CRow className="g-4">
          <CCol xs={12} md={3}>
            <h5 className="mb-3 small fw-bold">ABOUT US</h5>
            <p className="small text-muted">
              미니멀한 디자인과 고품질 소재로 제작된 패션 아이템을 제공합니다. 트렌디하면서도 시간이
              지나도 변하지 않는 스타일을 추구합니다.
            </p>
          </CCol>

          <CCol xs={12} md={3}>
            <h5 className="mb-3 small fw-bold">CUSTOMER SERVICE</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/faq" className="text-decoration-none text-muted">
                  자주 묻는 질문
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-decoration-none text-muted">
                  배송 안내
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-decoration-none text-muted">
                  교환 및 반품
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-muted">
                  문의하기
                </Link>
              </li>
            </ul>
          </CCol>

          <CCol xs={12} md={3}>
            <h5 className="mb-3 small fw-bold">MY ACCOUNT</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/login" className="text-decoration-none text-muted">
                  로그인
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-decoration-none text-muted">
                  회원가입
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/order-tracking" className="text-decoration-none text-muted">
                  주문 조회
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/wishlist" className="text-decoration-none text-muted">
                  위시리스트
                </Link>
              </li>
            </ul>
          </CCol>

          <CCol xs={12} md={3}>
            <h5 className="mb-3 small fw-bold">FOLLOW US</h5>
            <div className="d-flex mb-3">
              <Link
                to="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3 text-dark"
              >
                {/* <CIcon icon={cilInstagram} size="lg" /> */}
              </Link>
              <Link
                to="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3 text-dark"
              >
                {/* <CIcon icon={cilFacebook} size="lg" /> */}
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark"
              >
                {/* <CIcon icon={cilTwitter} size="lg" /> */}
              </Link>
            </div>
            <p className="small text-muted mb-2">뉴스레터 구독하고 10% 할인 쿠폰 받기</p>
            <CInputGroup>
              <CFormInput placeholder="이메일 주소" size="sm" />
              <CButton color="dark" variant="outline">
                구독
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>

        <hr className="my-4" />

        <CRow>
          <CCol xs={12} md={6} className="small text-muted mb-3 mb-md-0">
            <p className="mb-1">상호: 패션샵 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
            <p className="mb-0">주소: 서울특별시 강남구 테헤란로 123 | 전화: 02-1234-5678</p>
          </CCol>
          <CCol xs={12} md={6} className="small text-muted text-md-end">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Fashion Shop. All rights reserved.
            </p>
          </CCol>
        </CRow>
      </CContainer>
    </CFooter>
  )
}

export default UserFooter
