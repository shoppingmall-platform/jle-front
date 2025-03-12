import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CProgress,
} from '@coreui/react'
const Profile = () => {
  return (
    <CContainer className="mt-5 mb-5 text-center" style={{ maxWidth: '1000px' }}>
      <h4 className="mb-5">회원 정보 수정</h4>
      <CCard className="mb-4" style={{ minHeight: '150px' }}></CCard>
    </CContainer>
  )
}

export default Profile
