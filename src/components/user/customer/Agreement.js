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
        <div
          className="mb-4 p-3"
          style={{
            border: '2px solid #0d6efd',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
          }}
        >
          <CFormCheck
            id="allChecked"
            label={<strong style={{ fontSize: '1.1rem' }}>전체 동의하기</strong>}
            checked={allChecked}
            onChange={handleAllChecked}
          />
          <small className="text-muted d-block mt-2">
            서비스 이용약관, 개인정보 수집 및 이용, 마케팅 정보 수신(선택)에 모두 동의합니다.
          </small>
        </div>

        {/* [필수] 이용약관 */}
        <div className="mb-3">
          <CFormCheck
            id="tosAgreement"
            label={
              <span>
                <strong>[필수]</strong> 이용약관 동의
              </span>
            }
            checked={tosAgreement}
            onChange={handleTosChange}
          />
          <CCard className="mt-2" style={{ border: '1px solid #dee2e6' }}>
            <CCardBody
              style={{
                maxHeight: '120px',
                overflowY: 'auto',
                fontSize: '0.85rem',
                backgroundColor: '#fafafa',
                padding: '1rem',
                lineHeight: '1.6',
              }}
            >
              <p>
                <strong>제1조 (목적)</strong>
              </p>
              <p>
                본 약관은 회사가 제공하는 전자상거래 관련 서비스(이하 "서비스"라 합니다)의 이용과
                관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>

              <p>
                <strong>제2조 (정의)</strong>
              </p>
              <p>
                1. "회사"란 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를
                이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 운영하는 사업자를
                말합니다.
              </p>
              <p>
                2. "이용자"란 "쇼핑몰"에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 회원
                및 비회원을 말합니다.
              </p>

              <p>
                <strong>제3조 (약관의 게시와 개정)</strong>
              </p>
              <p>
                1. 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
              </p>
              <p>2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
            </CCardBody>
          </CCard>
        </div>

        {/* [필수] 개인정보 처리방침 */}
        <div className="mb-3">
          <CFormCheck
            id="privacyAgreement"
            label={
              <span>
                <strong>[필수]</strong> 개인정보 수집 및 이용 동의
              </span>
            }
            checked={privacyAgreement}
            onChange={handlePrivacyChange}
          />
          <CCard className="mt-2" style={{ border: '1px solid #dee2e6' }}>
            <CCardBody
              style={{
                maxHeight: '120px',
                overflowY: 'auto',
                fontSize: '0.85rem',
                backgroundColor: '#fafafa',
                padding: '1rem',
                lineHeight: '1.6',
              }}
            >
              <p>
                <strong>수집하는 개인정보 항목</strong>
              </p>
              <p>
                회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고
                있습니다.
              </p>
              <p>• 필수항목: 이름, 이메일, 전화번호, 비밀번호</p>
              <p>• 선택항목: 성별, 생년월일</p>

              <p>
                <strong>개인정보의 수집 및 이용목적</strong>
              </p>
              <p>
                • 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용
                방지
              </p>
              <p>• 서비스 제공: 주문 및 결제, 물품배송 또는 청구지 발송</p>
              <p>
                • 마케팅 및 광고: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공
              </p>

              <p>
                <strong>개인정보의 보유 및 이용기간</strong>
              </p>
              <p>회원 탈퇴 시까지 보유하며, 관계 법령에 따라 일정 기간 보관 후 파기합니다.</p>
            </CCardBody>
          </CCard>
        </div>

        {/* [선택] 마케팅 수신 동의 */}
        <div className="mb-3">
          <CFormCheck
            id="marketingAgreement"
            label={
              <span>
                <strong>[선택]</strong> 마케팅 정보 수신 동의 (이메일/SMS)
              </span>
            }
            checked={marketingAgreement}
            onChange={handleMarketingChange}
          />
          <CCard className="mt-2" style={{ border: '1px solid #dee2e6' }}>
            <CCardBody
              style={{
                maxHeight: '120px',
                overflowY: 'auto',
                fontSize: '0.85rem',
                backgroundColor: '#fafafa',
                padding: '1rem',
                lineHeight: '1.6',
              }}
            >
              <p>
                <strong>마케팅 정보 수신 동의</strong>
              </p>
              <p>
                회사가 제공하는 이벤트, 프로모션, 신상품 안내 등의 마케팅 정보를 이메일 및 SMS로
                받아보실 수 있습니다.
              </p>

              <p>
                <strong>수신 정보</strong>
              </p>
              <p>• 신규 상품 및 서비스 안내</p>
              <p>• 할인 이벤트 및 프로모션 정보</p>
              <p>• 맞춤형 상품 추천</p>

              <p>
                <strong>철회 방법</strong>
              </p>
              <p>
                마이페이지에서 언제든지 수신 동의를 철회하실 수 있으며, 수신 거부 시에도 회원 서비스
                이용에는 영향이 없습니다.
              </p>

              <p className="text-muted mt-2">
                <small>※ 동의를 거부하실 수 있으며, 거부 시에도 서비스 이용이 가능합니다.</small>
              </p>
            </CCardBody>
          </CCard>
        </div>
      </CForm>
    </CContainer>
  )
}

export default Agreement
