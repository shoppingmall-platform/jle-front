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

        const res = await registerMember(signupRequestBody)
        console.log('✅ 회원가입 성공', res)
        setActiveStep((prev) => prev + 1)
      } catch (error) {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.')
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
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
                      <p className="mt-5 mb-4">지금 바로 쇼핑을 시작해보세요.</p>
                      <CButton color="dark" className="w-100" onClick={() => navigate('/')}>
                        쇼핑하러 가기
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
