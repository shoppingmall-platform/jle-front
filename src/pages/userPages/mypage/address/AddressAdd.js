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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import DaumPostcode from 'react-daum-postcode'

const AddressAdd = () => {
  const navigate = useNavigate()

  const [label, setLabel] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const handleComplete = (data) => {
    const fullAddress = data.address
    setAddress(fullAddress)
    setShowModal(false)
  }

  const handleSubmit = () => {
    if (!label || !name || !address || !phone) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    const newAddress = {
      label,
      name,
      address,
      detailAddress,
      phone,
      isDefault,
    }

    console.log('등록된 주소:', newAddress)

    alert('주소가 등록되었습니다!')
    navigate('/mypage/address')
  }

  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h4 className="mb-4 text-center">주소지 등록</h4>
      <CCard>
        <CCardHeader>배송지 정보 입력</CCardHeader>
        <CCardBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>주소지 별칭</CFormLabel>
              <CFormInput value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormLabel>수령인</CFormLabel>
              <CFormInput value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormLabel>주소</CFormLabel>
              <CRow className="g-2">
                <CCol>
                  <CFormInput value={address} readOnly placeholder="주소를 검색해주세요" />
                </CCol>
                <CCol xs="auto">
                  <CButton color="secondary" onClick={() => setShowModal(true)}>
                    주소 검색
                  </CButton>
                </CCol>
              </CRow>
            </div>
            <div className="mb-3">
              <CFormLabel>상세 주소</CFormLabel>
              <CFormInput
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>전화번호</CFormLabel>
              <CFormInput value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormCheck
                label="기본 배송지로 설정"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
            </div>
            <div className="text-end">
              <CButton color="primary" onClick={handleSubmit}>
                저장
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* 주소 검색 모달 */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalBody>
          <DaumPostcode onComplete={handleComplete} />
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default AddressAdd
