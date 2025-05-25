import React, { useState, useEffect } from 'react'
import { CForm, CFormCheck, CContainer, CCard, CCardBody, CCardHeader } from '@coreui/react'

const Agreement = ({ onAgreementChange }) => {
  const [tosAgreement, setTosAgreement] = useState(false)
  const [privacyAgreement, setPrivacyAgreement] = useState(false)
  const [marketingAgreement, setMarketingAgreement] = useState(false)

  // 전체 동의 체크 상태 계산
  const allChecked = tosAgreement && privacyAgreement && marketingAgreement

  const handleAllChecked = (e) => {
    const isChecked = e.target.checked
    setTosAgreement(isChecked)
    setPrivacyAgreement(isChecked)
    setMarketingAgreement(isChecked)
  }

  const handleTosChange = (e) => setTosAgreement(e.target.checked)
  const handlePrivacyChange = (e) => setPrivacyAgreement(e.target.checked)
  const handleMarketingChange = (e) => setMarketingAgreement(e.target.checked)

  useEffect(() => {
    onAgreementChange({
      tosAgreement,
      privacyAgreement,
      marketingAgreement,
    })
  }, [tosAgreement, privacyAgreement, marketingAgreement])

  return (
    <CContainer>
      <CForm>
        {/* 전체 동의 */}
        <div className="mb-3">
          <CFormCheck
            id="allChecked"
            label="전체 동의"
            checked={allChecked}
            onChange={handleAllChecked}
          />
        </div>

        {/* [필수] 이용약관 */}
        <CCard className="mb-3">
          <CCardHeader>
            <CFormCheck
              id="tosAgreement"
              label="[필수] 이용약관 동의"
              checked={tosAgreement}
              onChange={handleTosChange}
            />
          </CCardHeader>
          <CCardBody style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
            이용약관 전문 내용이 들어갑니다. 스크롤 가능한 카드입니다. Lorem ipsum...
          </CCardBody>
        </CCard>

        {/* [필수] 개인정보 처리방침 */}
        <CCard className="mb-3">
          <CCardHeader>
            <CFormCheck
              id="privacyAgreement"
              label="[필수] 개인정보 수집 및 이용 동의"
              checked={privacyAgreement}
              onChange={handlePrivacyChange}
            />
          </CCardHeader>
          <CCardBody style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
            개인정보 처리방침 내용이 들어갑니다. 스크롤 가능. Lorem ipsum...
          </CCardBody>
        </CCard>

        {/* [선택] 마케팅 수신 동의 */}
        <CCard className="mb-3">
          <CCardHeader>
            <CFormCheck
              id="marketingAgreement"
              label="[선택] 마케팅 정보 수신 동의 (이메일/SMS)"
              checked={marketingAgreement}
              onChange={handleMarketingChange}
            />
          </CCardHeader>
          <CCardBody style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
            마케팅 수신 안내문이 들어갑니다. 선택 항목입니다. Lorem ipsum...
          </CCardBody>
        </CCard>
      </CForm>
    </CContainer>
  )
}

export default Agreement
