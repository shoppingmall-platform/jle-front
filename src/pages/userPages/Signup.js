import React, { useState } from 'react'
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
import Agreement from '@/components/user/customer/Agreement'
import InputSignup from '@/components/user/customer/InputSignup'

const steps = ['약관동의', '정보입력', '가입완료']

export default function Signup() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAgreed, setIsAgreed] = useState(false)
  const [isValidInput, setIsValidInput] = useState(false)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleAgreementChange = (isChecked) => {
    setIsAgreed(isChecked)
  }

  const handleValidityChange = (isValid) => {
    setIsValidInput(isValid)
  }

  return (
    <CContainer className="mt-5 mb-5">
      <h4 className="text-center mb-5">회원가입</h4>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard style={{ minHeight: '400px', width: '100%' }}>
            <CCardBody style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: '1 1 auto' }}>
                {/* Progress Indicator */}
                <CProgress className="mb-4" value={((activeStep + 1) / steps.length) * 100} />

                {/* Step Content */}
                <div className="mb-4">
                  {activeStep === 0 && <Agreement onAgreementChange={handleAgreementChange} />}
                  {activeStep === 1 && <InputSignup onValidityChange={handleValidityChange} />}
                  {activeStep === 2 && (
                    <div className="text-center">
                      <h5>가입이 완료되었습니다!</h5>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
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
                        (activeStep === 0 && !isAgreed) || (activeStep === 1 && !isValidInput)
                      }
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
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
