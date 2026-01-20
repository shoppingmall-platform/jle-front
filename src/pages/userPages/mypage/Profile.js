import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import {
  getMemberInfo,
  updateMember,
  withdrawMember,
  changePassword,
  logout,
} from '@/apis/member/memberApis'
import { authStore } from '@/store/auth/authStore'

const Profile = () => {
  const navigate = useNavigate()
  const [id, setId] = useState('') // 수정 불가
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({
    password: false,
    passwordConfirm: false,
    phoneNumber: false,
  })

  // 전화번호 자동 포맷팅
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const info = await getMemberInfo()
        console.log('📦 회원정보 조회:', info)
        setId(info.memberId)
        setName(info.name || '')
        setPhoneNumber(info.phoneNumber || '')
        setGender(info.gender || '')
        setBirthDate(info.birthday || '')
      } catch (error) {
        console.error('❌ 회원정보 조회 실패:', error)

        // 401 Unauthorized 에러 처리
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.')
          navigate('/login')
          return
        }

        alert('회원정보를 불러오는데 실패했습니다.')
      }
    }
    fetchData()
  }, [])

  const validate = () => {
    const errs = {}

    // 비밀번호 검증 (입력했을 때만)
    if (password) {
      if (password.length < 8) {
        errs.password = '비밀번호는 8자 이상이어야 합니다.'
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
        errs.password = '영문+숫자+특수문자 포함 8자 이상 입력하세요.'
      }
    }

    // 비밀번호 확인 검증
    if (password && password !== passwordConfirm) {
      errs.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    // 전화번호 검증 (하이픈 포함 형식)
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
    if (!phoneRegex.test(phoneNumber)) {
      errs.phoneNumber = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
    }

    return errs
  }

  // 실시간 유효성 검사
  useEffect(() => {
    if (touched.password || touched.passwordConfirm || touched.phoneNumber) {
      const errs = validate()
      setErrors(errs)
    }
  }, [password, passwordConfirm, phoneNumber, touched])

  const handleSubmit = async () => {
    // 모든 필드 터치 상태로 변경
    setTouched({
      password: true,
      passwordConfirm: true,
      phoneNumber: true,
    })

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      alert('입력 정보를 확인해주세요.')
      return
    }
    setErrors({})

    // 비밀번호 변경과 일반 정보 수정 분리
    if (password) {
      // ✅ 비밀번호만 변경하는 경우
      setShowPasswordModal(true)
    } else {
      // ✅ 비밀번호 제외한 일반 정보만 수정
      const payload = {
        name,
        birthday: birthDate || null,
        phoneNumber,
        gender: gender || null,
      }
      console.log('📤 회원정보 수정 요청:', payload)

      try {
        const result = await updateMember(payload)
        console.log('✅ 회원정보 수정 성공:', result)
        alert('회원정보가 수정되었습니다.')
      } catch (error) {
        console.error('❌ 회원정보 수정 실패:', error)
        alert('회원정보 수정에 실패했습니다.')
      }
    }
  }

  const handlePasswordConfirm = async () => {
    if (!oldPassword) {
      alert('기존 비밀번호를 입력하세요')
      return
    }

    setShowPasswordModal(false)

    try {
      // ✅ Step 1: 비밀번호 변경 API 호출 (memberId + oldPassword + newPassword)
      console.log('🔐 비밀번호 변경 요청')
      await changePassword(id, oldPassword, password)
      console.log('✅ 비밀번호 변경 성공')

      // ✅ Step 2: 일반 정보도 수정 (비밀번호 제외)
      const payload = {
        name,
        birthday: birthDate || null,
        phoneNumber,
        gender: gender || null,
      }
      console.log('📤 회원정보 수정 요청:', payload)

      await updateMember(payload)
      console.log('✅ 회원정보 수정 성공')

      alert('비밀번호 및 회원정보가 수정되었습니다.')

      // 비밀번호 초기화
      setPassword('')
      setPasswordConfirm('')
      setOldPassword('')
    } catch (error) {
      console.error('❌ 수정 실패:', error)
      alert('수정에 실패했습니다. 기존 비밀번호를 확인해주세요.')
    }
  }

  const handleWithdraw = async () => {
    if (
      window.confirm('정말 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.')
    ) {
      try {
        console.log('🚪 회원 탈퇴 시작 - memberId:', id)

        // 1. 탈퇴 API 호출 (memberId 전달)
        await withdrawMember(id)
        console.log('✅ 탈퇴 API 성공')

        // 2. 로그아웃 API 호출 (서버 세션 정리)
        try {
          await logout()
          console.log('✅ 로그아웃 API 성공')
        } catch (logoutError) {
          // 로그아웃 실패해도 계속 진행
          console.warn('⚠️ 로그아웃 API 실패 (무시):', logoutError)
        }

        // 3. 클라이언트 상태 정리
        authStore.getState().setUser({})
        authStore.getState().setToken(null)
        console.log('✅ 클라이언트 상태 정리 완료')

        // 4. 세션 스토리지 정리
        sessionStorage.clear()
        console.log('✅ 세션 스토리지 정리 완료')

        alert('탈퇴가 완료되었습니다.')

        // 5. 홈으로 이동 (페이지 새로고침)
        window.location.href = '/'
      } catch (error) {
        console.error('❌ 회원 탈퇴 실패:', error)
        const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류'
        alert(`회원 탈퇴에 실패했습니다.\n${errorMessage}`)
      }
    }
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
                <CTableHeaderCell>아이디</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput size="sm" value={id} disabled />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>이름</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput size="sm" value={name} onChange={(e) => setName(e.target.value)} />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>비밀번호 변경</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    type="password"
                    placeholder="변경할 비밀번호 (영문+숫자+특수문자 8자 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    invalid={touched.password && !!errors.password}
                    valid={touched.password && !errors.password && !!password}
                  />
                  {touched.password && errors.password && (
                    <CFormFeedback invalid>{errors.password}</CFormFeedback>
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>비밀번호 확인</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onBlur={() => setTouched({ ...touched, passwordConfirm: true })}
                    invalid={touched.passwordConfirm && !!errors.passwordConfirm}
                    valid={touched.passwordConfirm && !errors.passwordConfirm && !!passwordConfirm}
                  />
                  {touched.passwordConfirm && errors.passwordConfirm && (
                    <CFormFeedback invalid>{errors.passwordConfirm}</CFormFeedback>
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>휴대전화</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
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
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>추가 정보</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>성별</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <div className="d-flex gap-4">
                    <CFormCheck
                      type="radio"
                      name="gender"
                      label="남"
                      checked={gender === 'M'}
                      onChange={() => setGender('M')}
                    />
                    <CFormCheck
                      type="radio"
                      name="gender"
                      label="여"
                      checked={gender === 'F'}
                      onChange={() => setGender('F')}
                    />
                    <CFormCheck
                      type="radio"
                      name="gender"
                      label="선택 안 함"
                      checked={gender === ''}
                      onChange={() => setGender('')}
                    />
                  </div>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>생년월일</CTableHeaderCell>
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

      <div className="text-end mt-4 d-flex justify-content-between">
        <CButton color="danger" variant="outline" onClick={handleWithdraw}>
          회원 탈퇴
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          저장
        </CButton>
      </div>

      {/* ✅ 기존 비밀번호 입력 모달 */}
      <CModal visible={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <CModalHeader>
          <CModalTitle>기존 비밀번호 확인</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="password"
            placeholder="기존 비밀번호를 입력하세요"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPasswordModal(false)}>
            취소
          </CButton>
          <CButton color="primary" onClick={handlePasswordConfirm}>
            확인
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Profile
