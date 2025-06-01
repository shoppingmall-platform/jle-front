import React, { useState } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CAlert,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import DaumPostcode from 'react-daum-postcode'
import addressApis from '@/apis/member/addressApis'

const AddressAdd = () => {
  const navigate = useNavigate()

  const [alias, setAlias] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)

  const handleComplete = (data) => {
    setZipcode(data.zonecode)
    setAddress1(data.address)
    setShowModal(false)
  }

  // ✅ 전화번호 자동 하이픈 처리 함수
  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.length <= 3) return onlyNums
    if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`
  }

  const handleSubmit = async () => {
    if (!alias || !receiverName || !zipcode || !address1 || !phoneNumber) {
      setAlertMsg('필수 항목을 모두 입력해주세요.')
      return
    }

    // ✅ 전화번호 형식 검증
    const isValidPhoneNumber = /^01[016789]-\d{3,4}-\d{4}$/.test(phoneNumber)
    if (!isValidPhoneNumber) {
      setAlertMsg('전화번호 형식이 올바르지 않습니다.')
      return
    }

    const newAddress = {
      alias,
      zipcode,
      address1,
      address2,
      receiverName,
      phoneNumber,
      isDefault: isDefault ? 1 : 0,
    }

    try {
      await addressApis.registerAddress(newAddress)
      alert('주소가 등록되었습니다!')
      navigate('/mypage/address')
    } catch (error) {
      setAlertMsg('주소 등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h4 className="mb-4 text-center">주소지 등록</h4>
      {alertMsg && <CAlert color="danger">{alertMsg}</CAlert>}
      <CCard>
        <CCardHeader>배송지 정보 입력</CCardHeader>
        <CCardBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>주소지 별칭</CFormLabel>
              <CFormInput value={alias} onChange={(e) => setAlias(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormLabel>수령인</CFormLabel>
              <CFormInput value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormLabel>우편번호</CFormLabel>
              <CRow className="g-2">
                <CCol>
                  <CFormInput value={zipcode} readOnly placeholder="우편번호" />
                </CCol>
                <CCol xs="auto">
                  <CButton color="secondary" onClick={() => setShowModal(true)}>
                    주소 검색
                  </CButton>
                </CCol>
              </CRow>
            </div>
            <div className="mb-3">
              <CFormLabel>기본 주소</CFormLabel>
              <CFormInput value={address1} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel>상세 주소</CFormLabel>
              <CFormInput value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormLabel>전화번호</CFormLabel>
              <CFormInput
                value={phoneNumber}
                placeholder="010-1234-5678"
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              />
            </div>
            <div className="mb-3">
              <CFormCheck
                label="기본 배송지로 설정"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
            </div>
            <div className="text-end d-flex justify-content-between">
              <CButton color="secondary" onClick={() => navigate('/mypage/address')}>
                뒤로가기
              </CButton>
              <CButton color="primary" onClick={handleSubmit}>
                저장
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalBody>
          <DaumPostcode onComplete={handleComplete} />
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default AddressAdd
