import React, { useEffect, useState } from 'react'
import { CForm, CFormInput, CFormSelect } from '@coreui/react'

export default function InputSignup({ onValidityChange }) {
  const [memberId, setMemberId] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(memberId)

    const isValid =
      isEmailValid && !!name && !!password && password === passwordConfirm && !!phoneNumber

    const formData = {
      memberId,
      password,
      name,
      birthday: birthday || null,
      gender: gender || null,
      phoneNumber,
    }

    onValidityChange(isValid, isValid ? formData : null)
  }, [memberId, name, password, passwordConfirm, gender, birthday, phoneNumber])

  return (
    <CForm>
      <CFormInput
        className="mb-3"
        type="email" // 이메일 타입 지정
        label="이메일(ID)"
        placeholder="example@email.com"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
      />
      <CFormInput
        className="mb-3"
        type="password"
        label="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <CFormInput
        className="mb-3"
        type="password"
        label="비밀번호 확인"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <CFormInput
        className="mb-3"
        label="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CFormInput
        className="mb-3"
        type="tel"
        label="전화번호"
        placeholder="010-1234-5678"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <CFormSelect
        className="mb-3"
        label="성별 (선택)"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">선택 안 함</option>
        <option value="M">남자</option>
        <option value="F">여자</option>
      </CFormSelect>
      <CFormInput
        className="mb-3"
        type="date"
        label="생일 (선택)"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />
    </CForm>
  )
}
