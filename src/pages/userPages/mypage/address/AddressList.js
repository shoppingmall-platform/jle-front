import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AddressList = () => {
  const navigate = useNavigate()

  // 🚧 실제 API 대신 더미 데이터로 구성
  const addressList = [
    {
      id: 1,
      label: '집',
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123',
      detailAddress: '101동 1001호',
      isDefault: true,
    },
    {
      id: 2,
      label: '회사',
      name: '김영희',
      phone: '010-9876-5432',
      address: '경기도 성남시 분당구 판교로 456',
      detailAddress: '2층 프론트 앞',
      isDefault: false,
    },
  ]

  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '1000px' }}>
      <h4 className="mb-5">배송지 관리</h4>
      <CCard className="mb-4">
        <CCardHeader>배송지 목록</CCardHeader>
        <CCardBody>
          <CTable bordered hover responsive>
            <thead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>주소지 별칭</CTableHeaderCell>
                <CTableHeaderCell>수령인</CTableHeaderCell>
                <CTableHeaderCell>주소</CTableHeaderCell>
                <CTableHeaderCell>상세주소</CTableHeaderCell>
                <CTableHeaderCell>전화번호</CTableHeaderCell>
                <CTableHeaderCell>기본 배송지</CTableHeaderCell>
              </CTableRow>
            </thead>
            <CTableBody>
              {addressList.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.id}</CTableDataCell>
                  <CTableDataCell>{item.label}</CTableDataCell>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.address}</CTableDataCell>
                  <CTableDataCell>{item.detailAddress}</CTableDataCell>
                  <CTableDataCell>{item.phone}</CTableDataCell>
                  <CTableDataCell>
                    {item.isDefault ? <span className="badge bg-primary">기본</span> : '-'}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <div className="text-end">
        <CButton color="primary" onClick={() => navigate('/mypage/address/add')}>
          주소지 등록
        </CButton>
      </div>
    </CContainer>
  )
}

export default AddressList
