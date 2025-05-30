import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CFormCheck,
  CAlert,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import addressApis from '@/apis/member/addressApis'

const AddressList = () => {
  const navigate = useNavigate()
  const [addressList, setAddressList] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)

  const fetchAddresses = async () => {
    try {
      const addressData = await addressApis.getMyAddresses()
      setAddressList(addressData || [])
    } catch {
      setAlertMsg('배송지 정보를 불러오는 데 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!selectedAddressId) return setAlertMsg('삭제할 배송지를 선택해주세요.')
    try {
      await addressApis.deleteAddress(selectedAddressId)
      setSelectedAddressId(null)
      fetchAddresses()
    } catch {
      setAlertMsg('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleSetDefault = async () => {
    const item = addressList.find((a) => a.addressId === selectedAddressId)
    if (!item) return setAlertMsg('기본으로 설정할 배송지를 선택해주세요.')

    try {
      await addressApis.updateAddress({ ...item, isDefault: 1 })
      fetchAddresses()
    } catch {
      setAlertMsg('기본 배송지 설정 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  return (
    <CContainer style={{ maxWidth: '1200px' }} className="mt-5">
      <h4 className="mb-1">배송 주소록 관리</h4>
      <p className="text-muted mb-4">자주 쓰는 배송지들을 등록/관리하실 수 있습니다.</p>

      {alertMsg && <CAlert color="danger">{alertMsg}</CAlert>}

      <CTable bordered hover responsive>
        <thead>
          <CTableRow>
            <CTableHeaderCell style={{ width: '5%' }}></CTableHeaderCell> {/* 체크박스 */}
            <CTableHeaderCell style={{ width: '10%' }}>배송지명</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '10%' }}>수령인</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '10%' }}>일반전화</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '15%' }}>휴대전화</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '45%' }}>주소</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '10%' }}>기본 여부</CTableHeaderCell>
          </CTableRow>
        </thead>
        <CTableBody>
          {addressList.map((item) => (
            <CTableRow key={item.addressId}>
              <CTableDataCell>
                <CFormCheck
                  type="radio"
                  name="selectAddress"
                  checked={selectedAddressId === item.addressId}
                  onChange={() => setSelectedAddressId(item.addressId)}
                />
              </CTableDataCell>
              <CTableDataCell>{item.alias}</CTableDataCell>
              <CTableDataCell>{item.receiverName}</CTableDataCell>
              <CTableDataCell>-</CTableDataCell>
              <CTableDataCell>{item.phoneNumber}</CTableDataCell>
              <CTableDataCell>{`(${item.zipcode})${item.address1} ${item.address2}`}</CTableDataCell>
              <CTableDataCell>
                {item.isDefault && <span className="badge bg-primary">기본</span>}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* 하단 버튼 영역 */}
      <div className="d-flex justify-content-between mt-3">
        <CButton
          color="danger"
          variant="outline"
          onClick={handleDelete}
          disabled={!selectedAddressId}
        >
          선택 주소록 삭제
        </CButton>

        <div className="d-flex gap-2">
          <CButton color="secondary" onClick={handleSetDefault} disabled={!selectedAddressId}>
            기본 배송지로 설정
          </CButton>
          <CButton color="dark" onClick={() => navigate('/mypage/address/add')}>
            배송지등록
          </CButton>
        </div>
      </div>
    </CContainer>
  )
}

export default AddressList
