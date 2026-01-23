import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CButton, CCard, CCardBody, CProgress } from '@coreui/react'
import Agreement from '@/components/user/customer/Agreement'
import InputSignup from '@/components/user/customer/InputSignup'
import { registerMember } from '@/apis/member/memberApis'

const steps = ['약관동의', '정보입력', '가입완료']

export default function Signup() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAgreed, setIsAgreed] = useState(false)
  const [agreementData, setAgreementData] = useState({
    tosAgreement: false,
    privacyAgreement: false,
    marketingAgreement: false,
  })
  const [isValidInput, setIsValidInput] = useState(false)
  const [signupData, setSignupData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleNext = async () => {
    if (activeStep === 1) {
      try {
        setIsSubmitting(true)

        const signupRequestBody = {
          ...signupData,
          ...agreementData,
        }

        // 회원가입
        const res = await registerMember(signupRequestBody)
        console.log('✅ 회원가입 성공', res)

        // 성공 페이지로 이동
        setActiveStep((prev) => prev + 1)
      } catch (error) {
        console.error('❌ 회원가입 실패:', error)

        // 에러 메시지 상세하게 표시
        const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류'
        alert(`회원가입에 실패했습니다.\n${errorMessage}\n\n다시 시도해주세요.`)

        // ⚠️ 여기서는 setActiveStep을 호출하지 않음 = 현재 페이지 유지
      } finally {
        setIsSubmitting(false)
      }
    } else if (activeStep === 2) {
      // ✅ Finish 단계면 로그인 페이지로 이동
      navigate('/login')
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  // ✅ 약관 동의 콜백
  const handleAgreementChange = (data) => {
    setAgreementData(data)
    setIsAgreed(data.tosAgreement && data.privacyAgreement) // 필수 항목 체크 여부
  }

  // ✅ 정보 입력 유효성 콜백
  const handleValidityChange = (isValid, data = null) => {
    setIsValidInput(isValid)
    if (data) {
      setSignupData(data)
    }
  }

  return (
    <CContainer className="mt-5 mb-5">
      <h4 className="text-center mb-5">회원가입</h4>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard style={{ minHeight: '400px', width: '100%' }}>
            <CCardBody style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: '1 1 auto' }}>
                <CProgress
                  className="mb-4"
                  color="dark"
                  value={((activeStep + 1) / steps.length) * 100}
                />

                <div className="mb-4">
                  {activeStep === 0 && <Agreement onAgreementChange={handleAgreementChange} />}
                  {activeStep === 1 && <InputSignup onValidityChange={handleValidityChange} />}
                  {activeStep === 2 && (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center text-center"
                      style={{ height: '100%' }}
                    >
                      <h4 className="mt-5 mb-3">🎉 회원가입을 축하드립니다!</h4>
                      <p className="mt-3 mb-5 text-muted">
                        가입하신 계정으로 로그인하여
                        <br />
                        다양한 서비스를 이용해보세요.
                      </p>
                      <CButton
                        color="dark"
                        size="lg"
                        className="w-100"
                        onClick={() => navigate('/login')}
                        style={{ padding: '12px' }}
                      >
                        로그인하러 가기
                      </CButton>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <CRow>
                  <CCol className="text-start">
                    <CButton color="secondary" disabled={activeStep === 0} onClick={handleBack}>
                      Back
                    </CButton>
                  </CCol>
                  <CCol className="text-end">
                    <CButton
                      color="primary"
                      onClick={handleNext}
                      disabled={
                        (activeStep === 0 && !isAgreed) ||
                        (activeStep === 1 && (!isValidInput || isSubmitting))
                      }
                    >
                      {activeStep === steps.length - 1
                        ? 'Finish'
                        : activeStep === 1
                          ? 'SignUp'
                          : 'Next'}
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
