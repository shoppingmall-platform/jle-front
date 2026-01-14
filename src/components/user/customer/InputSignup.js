import React, { useEffect, useState } from 'react'
import { CForm, CFormInput, CFormSelect, CFormFeedback, CFormText } from '@coreui/react'

export default function InputSignup({ onValidityChange }) {
  const [memberId, setMemberId] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // 에러 상태
  const [errors, setErrors] = useState({
    memberId: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
  })

  // 터치 상태 (사용자가 입력한 적 있는지)
  const [touched, setTouched] = useState({
    memberId: false,
    password: false,
    passwordConfirm: false,
    phoneNumber: false,
  })

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return '이메일을 입력해주세요.'
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.'
    return ''
  }

  // 비밀번호 유효성 검사
  const validatePassword = (pwd) => {
    if (!pwd) return '비밀번호를 입력해주세요.'
    if (pwd.length < 8) return '비밀번호는 8자 이상이어야 합니다.'

    const hasLetter = /[a-zA-Z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return '영문, 숫자, 특수문자를 포함해야 합니다.'
    }
    return ''
  }

  // 비밀번호 확인 유효성 검사
  const validatePasswordConfirm = (pwd, confirm) => {
    if (!confirm) return '비밀번호 확인을 입력해주세요.'
    if (pwd !== confirm) return '비밀번호가 일치하지 않습니다.'
    return ''
  }

  // 전화번호 유효성 검사
  const validatePhoneNumber = (phone) => {
    if (!phone) return '전화번호를 입력해주세요.'
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
    if (!phoneRegex.test(phone)) return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
    return ''
  }

  // 전화번호 자동 포맷팅
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  useEffect(() => {
    // 유효성 검사 실행
    const newErrors = {
      memberId: touched.memberId ? validateEmail(memberId) : '',
      password: touched.password ? validatePassword(password) : '',
      passwordConfirm: touched.passwordConfirm
        ? validatePasswordConfirm(password, passwordConfirm)
        : '',
      phoneNumber: touched.phoneNumber ? validatePhoneNumber(phoneNumber) : '',
    }
    setErrors(newErrors)

    // 전체 유효성 확인
    const isValid =
      !newErrors.memberId &&
      !newErrors.password &&
      !newErrors.passwordConfirm &&
      !newErrors.phoneNumber &&
      !!memberId &&
      !!name &&
      !!password &&
      !!passwordConfirm &&
      !!phoneNumber

    const formData = {
      memberId,
      password,
      name,
      birthday: birthday || null,
      gender: gender || null,
      phoneNumber,
    }

    onValidityChange(isValid, isValid ? formData : null)
  }, [memberId, name, password, passwordConfirm, gender, birthday, phoneNumber, touched])

  return (
    <CForm>
      {/* 이메일 */}
      <div className="mb-3">
        <CFormInput
          type="email"
          label="이메일(ID)"
          placeholder="example@email.com"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          onBlur={() => setTouched({ ...touched, memberId: true })}
          invalid={touched.memberId && !!errors.memberId}
          valid={touched.memberId && !errors.memberId && !!memberId}
        />
        {touched.memberId && errors.memberId && (
          <CFormFeedback invalid>{errors.memberId}</CFormFeedback>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="mb-3">
        <CFormInput
          type="password"
          label="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched({ ...touched, password: true })}
          invalid={touched.password && !!errors.password}
          valid={touched.password && !errors.password && !!password}
        />
        {touched.password && errors.password && (
          <CFormFeedback invalid>{errors.password}</CFormFeedback>
        )}
        {!touched.password && (
          <CFormText className="text-muted">8자 이상, 영문+숫자+특수문자 조합</CFormText>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="mb-3">
        <CFormInput
          type="password"
          label="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          onBlur={() => setTouched({ ...touched, passwordConfirm: true })}
          invalid={touched.passwordConfirm && !!errors.passwordConfirm}
          valid={touched.passwordConfirm && !errors.passwordConfirm && !!passwordConfirm}
        />
        {touched.passwordConfirm && errors.passwordConfirm && (
          <CFormFeedback invalid>{errors.passwordConfirm}</CFormFeedback>
        )}
      </div>

      {/* 이름 */}
      <CFormInput
        className="mb-3"
        label="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 전화번호 */}
      <div className="mb-3">
        <CFormInput
          type="tel"
          label="전화번호"
          placeholder="010-1234-5678"
          value={phoneNumber}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value)
            setPhoneNumber(formatted)
          }}
          onBlur={() => setTouched({ ...touched, phoneNumber: true })}
          invalid={touched.phoneNumber && !!errors.phoneNumber}
          valid={touched.phoneNumber && !errors.phoneNumber && !!phoneNumber}
        />
        {touched.phoneNumber && errors.phoneNumber && (
          <CFormFeedback invalid>{errors.phoneNumber}</CFormFeedback>
        )}
      </div>

      {/* 성별 */}
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

      {/* 생일 */}
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
