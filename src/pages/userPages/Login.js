import React, { useState } from 'react'
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
  CNavLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilApple, cilMenu } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, getMemberInfo } from '@/apis/member/memberApis'
import { authStore } from '@/store/auth/authStore'

const Login = () => {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const setUser = authStore((state) => state.setUser)
  const setToken = authStore((state) => state.setToken)

  const handleLogin = async () => {
    try {
      const res = await loginApi(loginId, password)
      if (res?.accessToken) {
        // 토큰 저장
        setToken(res.accessToken)

        // 사용자 정보 조회
        const userInfo = await getMemberInfo()
        if (userInfo) {
          setUser(userInfo)
          navigate('/') // 로그인 성공 시 리디렉션
        }
      } else {
        alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.')
      }
    } catch (error) {
      console.error(error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '400px' }}>
      <h4 className="mb-5">로그인</h4>
      <CCard>
        <CCardBody>
          <CForm className="text-start" onSubmit={(e) => e.preventDefault()}>
            <CFormInput
              className="mb-3"
              type="email"
              id="email"
              label="ID"
              placeholder="Enter your email"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              floatingLabel={false}
            />
            <CFormInput
              className="mb-3"
              type="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              floatingLabel={false}
            />
            <div className="mb-3">
              <CFormCheck id="remember" label="로그인 상태 유지" />
            </div>
            <CButton color="dark" className="w-100 mb-3" onClick={handleLogin}>
              Login
            </CButton>
            <CButton
              variant="outline"
              color="dark"
              className="w-100 mb-3"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </CButton>
          </CForm>

          <CRow className="text-center mb-3">
            <CCol>
              <CNavLink href="#">아이디 찾기</CNavLink>
            </CCol>
            <CCol>
              <CNavLink href="#">비밀번호 찾기</CNavLink>
            </CCol>
          </CRow>

          <hr style={{ border: '1px solid #ddd', margin: '16px 0' }} />
          <CRow className="d-grid gap-3">
            <CCol>
              <CButton
                variant="outline"
                color="dark"
                className="w-100"
                startIcon={<CIcon icon={cilMenu} />}
              >
                네이버로 로그인
              </CButton>
            </CCol>
            <CCol>
              <CButton color="dark" className="w-100" startIcon={<CIcon icon={cilMenu} />}>
                카카오로 로그인
              </CButton>
            </CCol>
            <CCol>
              <CButton
                variant="outline"
                color="dark"
                className="w-100"
                startIcon={<CIcon icon={cilApple} />}
              >
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
