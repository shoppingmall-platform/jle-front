import React, { useEffect, useState } from 'react'
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
import { getMemberInfo, updateMember, withdrawMember } from '@/apis/member/memberApis'

const Profile = () => {
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

  useEffect(() => {
    async function fetchData() {
      const info = await getMemberInfo()
      setId(info.memberId)
      setName(info.name || '')
      setPhoneNumber(info.phoneNumber || '')
      setGender(info.gender || '')
      setBirthDate(info.birthday || '')
    }
    fetchData()
  }, [])

  const validate = () => {
    const errs = {}
    if (password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password))
      errs.password = '영문+숫자+특수문자 포함 8자 이상 입력하세요'
    if (password && password !== passwordConfirm)
      errs.passwordConfirm = '비밀번호가 일치하지 않습니다'
    if (!/^\d{10,11}$/.test(phoneNumber)) errs.phoneNumber = '휴대폰 번호 형식이 올바르지 않습니다'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})

    const payload = {
      name,
      birthday: birthDate,
      phoneNumber,
      gender: gender || null,
    }

    if (password) {
      setShowPasswordModal(true)
    } else {
      await updateMember(payload)
      alert('회원정보가 수정되었습니다.')
    }
  }

  const handlePasswordConfirm = async () => {
    if (!oldPassword) {
      alert('기존 비밀번호를 입력하세요')
      return
    }
    setShowPasswordModal(false)
    await updateMember({
      name,
      birthday: birthDate,
      phoneNumber,
      gender: gender || null,
      oldPassword,
      newPassword: password,
    })
    alert('비밀번호 포함 정보가 수정되었습니다.')
  }

  const handleWithdraw = async () => {
    if (confirm('정말 탈퇴하시겠습니까?')) {
      await withdrawMember()
      alert('탈퇴가 완료되었습니다.')
      // 로그아웃 또는 이동 처리
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={!!errors.password}
                  />
                  <CFormFeedback invalid>{errors.password}</CFormFeedback>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>비밀번호 확인</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    invalid={!!errors.passwordConfirm}
                  />
                  <CFormFeedback invalid>{errors.passwordConfirm}</CFormFeedback>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>휴대전화</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  <CFormInput
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    invalid={!!errors.phoneNumber}
                  />
                  <CFormFeedback invalid>{errors.phoneNumber}</CFormFeedback>
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
