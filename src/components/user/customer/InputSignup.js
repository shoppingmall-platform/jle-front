import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CFormFeedback,
  CButton,
} from '@coreui/react'

const InputSignup = ({ onValidityChange }) => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const [idError, setIdError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [isIdValid, setIsIdValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)

  const handleIdChange = (e) => {
    const value = e.target.value
    setId(value)
    if (/^[A-Za-z]{5,}$/.test(value)) {
      setIsIdValid(true)
      setIdError('')
    } else {
      setIsIdValid(false)
      setIdError('영문으로 5자 이상 입력해주세요')
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
      setIsPasswordValid(true)
      setPasswordError('')
    } else {
      setIsPasswordValid(false)
      setPasswordError('숫자+영문자+특수조합으로 8자 이상 입력해주세요')
    }
  }

  const handlePasswordConfirmChange = (e) => {
    const value = e.target.value
    setPasswordConfirm(value)
    if (value === password) {
      setIsPasswordConfirmValid(true)
      setPasswordConfirmError('')
    } else {
      setIsPasswordConfirmValid(false)
      setPasswordConfirmError('비밀번호가 일치하지 않습니다')
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
    setPhoneNumber(value)
    if (/^\d{10,11}$/.test(value)) {
      setIsPhoneValid(true)
      setPhoneError('')
    } else {
      setIsPhoneValid(false)
      setPhoneError('숫자만 입력해주세요')
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      setIsEmailValid(true)
      setEmailError('')
    } else {
      setIsEmailValid(false)
      setEmailError('유효한 이메일 형식으로 입력해주세요')
    }
  }

  useEffect(() => {
    const isAllValid =
      isIdValid && isPasswordValid && isPasswordConfirmValid && isPhoneValid && isEmailValid
    onValidityChange(isAllValid)
  }, [
    isIdValid,
    isPasswordValid,
    isPasswordConfirmValid,
    isPhoneValid,
    isEmailValid,
    onValidityChange,
  ])

  return (
    <form>
      <CTable>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">아이디</CTableHeaderCell>
            <CTableDataCell colSpan={2}>
              <CFormInput
                size="sm"
                value={id}
                onChange={handleIdChange}
                invalid={!!idError}
                valid={isIdValid}
              />
              {idError && <CFormFeedback invalid>{idError}</CFormFeedback>}
              {isIdValid && <CFormFeedback valid>사용 가능한 아이디입니다</CFormFeedback>}
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="primary" size="sm">
                중복확인
              </CButton>
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">비밀번호</CTableHeaderCell>
            <CTableDataCell colSpan={3}>
              <CFormInput
                size="sm"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                invalid={!!passwordError}
                valid={isPasswordValid}
              />
              {passwordError && <CFormFeedback invalid>{passwordError}</CFormFeedback>}
              {isPasswordValid && <CFormFeedback valid>사용 가능한 비밀번호입니다</CFormFeedback>}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">비밀번호 확인</CTableHeaderCell>
            <CTableDataCell colSpan={3}>
              <CFormInput
                size="sm"
                type="password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                invalid={!!passwordConfirmError}
                valid={isPasswordConfirmValid}
              />
              {passwordConfirmError && (
                <CFormFeedback invalid>{passwordConfirmError}</CFormFeedback>
              )}
              {isPasswordConfirmValid && <CFormFeedback valid>비밀번호가 일치합니다</CFormFeedback>}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">휴대전화</CTableHeaderCell>
            <CTableDataCell colSpan={3}>
              <CFormInput
                size="sm"
                value={phoneNumber}
                onChange={handlePhoneChange}
                invalid={!!phoneError}
                valid={isPhoneValid}
              />
              {phoneError && <CFormFeedback invalid>{phoneError}</CFormFeedback>}
              {isPhoneValid && <CFormFeedback valid>유효한 번호입니다</CFormFeedback>}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">이메일</CTableHeaderCell>
            <CTableDataCell colSpan={3}>
              <CFormInput
                size="sm"
                value={email}
                onChange={handleEmailChange}
                invalid={!!emailError}
                valid={isEmailValid}
              />
              {emailError && <CFormFeedback invalid>{emailError}</CFormFeedback>}
              {isEmailValid && <CFormFeedback valid>유효한 이메일입니다</CFormFeedback>}
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </form>
  )
}

export default InputSignup
