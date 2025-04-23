import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormFeedback,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const Profile = () => {
  // 기존 회원 정보 불러왔다고 가정
  const [id] = useState('sampleUser') // 수정 불가
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('01012345678')
  const [email, setEmail] = useState('user@example.com')

  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [emailAgree, setEmailAgree] = useState(true)
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const validatePassword = (value) => {
    if (!value) return true // 입력 안 하면 무시
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
  }

  const validateConfirm = (value) => {
    return value === password
  }

  const validatePhone = (value) => /^\d{10,11}$/.test(value)
  const validateEmail = (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)

  const handleSubmit = () => {
    let valid = true

    if (password && !validatePassword(password)) {
      setPasswordError('숫자+영문자+특수문자 조합으로 8자 이상 입력해주세요')
      valid = false
    } else {
      setPasswordError('')
    }

    if (password && !validateConfirm(passwordConfirm)) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다')
      valid = false
    } else {
      setPasswordConfirmError('')
    }

    if (!validatePhone(phoneNumber)) {
      setPhoneError('숫자만 입력해주세요')
      valid = false
    } else {
      setPhoneError('')
    }

    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 형식으로 입력해주세요')
      valid = false
    } else {
      setEmailError('')
    }

    if (!valid) return

    alert('회원 정보가 수정되었습니다!')
    // 실제 저장 API 호출 부분 추가
  }

  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '1000px' }}>
      <h4 className="mb-5">회원 정보 수정</h4>
      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">아이디</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput size="sm" value={id} disabled />
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">비밀번호 변경</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    size="sm"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={!!passwordError}
                  />
                  {passwordError && <CFormFeedback invalid>{passwordError}</CFormFeedback>}
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">비밀번호 확인</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    size="sm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    invalid={!!passwordConfirmError}
                  />
                  {passwordConfirmError && (
                    <CFormFeedback invalid>{passwordConfirmError}</CFormFeedback>
                  )}
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">휴대전화</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    size="sm"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    invalid={!!phoneError}
                  />
                  {phoneError && <CFormFeedback invalid>{phoneError}</CFormFeedback>}
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">이메일</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    size="sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    invalid={!!emailError}
                  />
                  {emailError && <CFormFeedback invalid>{emailError}</CFormFeedback>}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">이메일 수신 여부</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <div className="d-flex gap-4">
                    <CFormCheck
                      type="radio"
                      name="emailAgree"
                      id="emailAgreeYes"
                      label="예"
                      checked={emailAgree === true}
                      onChange={() => setEmailAgree(true)}
                    />
                    <CFormCheck
                      type="radio"
                      name="emailAgree"
                      id="emailAgreeNo"
                      label="아니오"
                      checked={emailAgree === false}
                      onChange={() => setEmailAgree(false)}
                    />
                  </div>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>추가 정보</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">성별</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <div className="d-flex gap-4">
                    <CFormCheck
                      type="radio"
                      name="gender"
                      id="genderMale"
                      label="남"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                    />
                    <CFormCheck
                      type="radio"
                      name="gender"
                      id="genderFemale"
                      label="여"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                    />
                    <CFormCheck
                      type="radio"
                      name="gender"
                      id="genderNone"
                      label="선택 안 함"
                      checked={gender === ''}
                      onChange={() => setGender('')}
                    />
                  </div>
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">생년월일</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <div className="text-end mt-4">
        <CButton color="primary" onClick={handleSubmit}>
          저장
        </CButton>
      </div>
    </CContainer>
  )
}

export default Profile
