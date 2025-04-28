import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormCheck,
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from '@coreui/react'

const Agreement = ({ onAgreementChange }) => {
  const [allChecked, setAllChecked] = useState(false)
  const [requiredChecked, setRequiredChecked] = useState({
    이용약관: false,
    개인정보: false,
  })
  const [optionalChecked, setOptionalChecked] = useState(false)

  const handleAllChecked = (event) => {
    const isChecked = event.target.checked
    setAllChecked(isChecked)
    setRequiredChecked({
      이용약관: isChecked,
      개인정보: isChecked,
    })
    setOptionalChecked(isChecked)
  }

  const handleRequiredChange = (event) => {
    const { name, checked } = event.target
    setRequiredChecked((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleOptionalChange = (event) => {
    setOptionalChecked(event.target.checked)
  }

  useEffect(() => {
    const allRequiredChecked = Object.values(requiredChecked).every(Boolean)
    onAgreementChange(allRequiredChecked)
    setAllChecked(allRequiredChecked && optionalChecked)
  }, [requiredChecked, optionalChecked, onAgreementChange])

  return (
    <CContainer>
      <CForm>
        <div className="mb-3">
          <CFormCheck
            id="allChecked"
            label="전체 동의"
            checked={allChecked}
            onChange={handleAllChecked}
          />
        </div>

        {/* 이용약관 */}
        <CCard className="mb-3">
          <CCardHeader>
            <CFormCheck
              id="이용약관"
              name="이용약관"
              label="[필수] 이용약관 동의"
              checked={requiredChecked.이용약관}
              onChange={handleRequiredChange}
            />
          </CCardHeader>
          <CCardBody style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
            이곳에 이용약관 전문이 들어갑니다. 이 텍스트는 스크롤이 가능하도록 제한된 높이의 카드에 들어갑니다.
            여러 줄을 넣어서 실제 텍스트가 길어도 잘 보여지는지 확인해보세요. 예: Lorem ipsum dolor sit amet...
            이곳에 이용약관 전문이 들어갑니다. 이 텍스트는 스크롤이 가능하도록 제한된 높이의 카드에 들어갑니다.
            여러 줄을 넣어서 실제 텍스트가 길어도 잘 보여지는지 확인해보세요. 예: Lorem ipsum dolor sit amet...
            이곳에 이용약관 전문이 들어갑니다. 이 텍스트는 스크롤이 가능하도록 제한된 높이의 카드에 들어갑니다.
            여러 줄을 넣어서 실제 텍스트가 길어도 잘 보여지는지 확인해보세요. 예: Lorem ipsum dolor sit amet...
            이곳에 이용약관 전문이 들어갑니다. 이 텍스트는 스크롤이 가능하도록 제한된 높이의 카드에 들어갑니다.
            여러 줄을 넣어서 실제 텍스트가 길어도 잘 보여지는지 확인해보세요. 예: Lorem ipsum dolor sit amet...
            이곳에 이용약관 전문이 들어갑니다. 이 텍스트는 스크롤이 가능하도록 제한된 높이의 카드에 들어갑니다.
            여러 줄을 넣어서 실제 텍스트가 길어도 잘 보여지는지 확인해보세요. 예: Lorem ipsum dolor sit amet...
            이곳에 이용약관 전문이 들어갑니다. 이 텍스트는 스크롤이 가능하도록 제한된 높이의 카드에 들어갑니다.
            여러 줄을 넣어서 실제 텍스트가 길어도 잘 보여지는지 확인해보세요. 예: Lorem ipsum dolor sit amet...
          </CCardBody>
        </CCard>

        {/* 개인정보 */}
        <CCard className="mb-3">
          <CCardHeader>
            <CFormCheck
              id="개인정보"
              name="개인정보"
              label="[필수] 개인정보 수집 및 이용 동의"
              checked={requiredChecked.개인정보}
              onChange={handleRequiredChange}
            />
          </CCardHeader>
          <CCardBody style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
            여기에 개인정보 처리방침 내용을 넣으세요. 스크롤이 잘 되는지 확인도 필요합니다.
          </CCardBody>
        </CCard>

        {/* 마케팅 수신 */}
        <CCard className="mb-3">
          <CCardHeader>
            <CFormCheck
              id="optional"
              label="[선택] 마케팅 정보 수신 동의 (이메일/SMS)"
              checked={optionalChecked}
              onChange={handleOptionalChange}
            />
          </CCardHeader>
          <CCardBody style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
            마케팅 정보 수신에 대한 안내문을 이곳에 작성하세요. 선택 항목이므로 필수는 아닙니다.
          </CCardBody>
        </CCard>
      </CForm>
    </CContainer>
  )
}

export default Agreement
