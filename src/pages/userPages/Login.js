import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilApple, cilMenu } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '400px' }}>
      <h4 className="mb-5">로그인</h4>
      <CCard>
        <CCardBody>
          <CForm>
            <CFormInput
              className="mb-3"
              type="email"
              id="email"
              label="ID"
              placeholder="Enter your email"
              required
            />
            <CFormInput
              className="mb-3"
              type="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
              required
            />
            <CFormCheck id="remember" label="로그인 상태 유지" className="mb-3" />
            <CButton color="dark" className="w-100 mb-3">
              Login
            </CButton>
          </CForm>

          <CNav vertical className="text-center">
            <CNavItem>
              <CNavLink href="#" onClick={() => navigate('/signup')}>
                회원가입
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">아이디 찾기</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">비밀번호 찾기</CNavLink>
            </CNavItem>
          </CNav>

          <hr style={{ border: '1px solid #ddd', margin: '16px 0' }} />
          <CRow>
            <CCol>
              <CButton color="secondary" className="w-100" startIcon={<CIcon icon={cilMenu} />}>
                네이버로 로그인
              </CButton>
            </CCol>
            <CCol>
              <CButton color="warning" className="w-100" startIcon={<CIcon icon={cilMenu} />}>
                카카오로 로그인
              </CButton>
            </CCol>
            <CCol>
              <CButton color="dark" className="w-100" startIcon={<CIcon icon={cilApple} />}>
                Apple로 로그인
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Login
