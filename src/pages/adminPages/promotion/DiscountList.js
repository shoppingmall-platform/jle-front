import { React, useState } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CFormCheck,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormTextarea,
} from '@coreui/react'
import '../adminpage.css'
import DateRangePicker from '@/components/admin/DateRangePicker'

const DiscountList = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>할인코드 조회</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>할인코드 검색</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">기간</td>
                <td colSpan="5">
                  <div className="d-flex gap-3">
                    <CFormSelect className="small-select">
                      <option>시작일</option>
                      <option>종료일</option>
                      <option>등록일</option>
                    </CFormSelect>
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      showButtons={true}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">할인코드 입력</td>
                <td colSpan="2">
                  <CFormInput className="small-form" />
                </td>

                <td className="text-center table-header">입력코드</td>
                <td colSpan="2">
                  <CFormInput className="small-form" />
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group">
        <CButton color="primary">검색</CButton>
      </div>
      <CCard className="mb-4">
        <CCardHeader>할인코드 목록</CCardHeader>
        <CCardBody>
          <div className="body-section">
            <CRow className="align-items-center">
              <CCol md="6">
                <span className="fw-bold">총 0개</span>
              </CCol>
              <CCol md="6" className="d-flex justify-content-end gap-2">
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>10개씩 보기</option>
                  <option>20개씩 보기</option>
                  <option>50개씩 보기</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>
          <div className="body-section">
            <CButton className="custom-button">탈퇴/삭제</CButton>
          </div>
          <table className="table">
            {/* 표의 헤더 */}
            {/* <thead className="table-head">
                    <tr>
                      <th>
                        <CFormCheck
                          checked={memberCheckbox.selectedItems.length === memberData.length}
                          onChange={memberCheckbox.handleSelectAll} // 전체 선택
                        />
                      </th>
                      <th>등록일</th>
                      <th>이름</th>
                      <th>아이디</th>
                      <th>등급</th>
                      <th>전화번호</th>
                      <th>성별</th>
                      <th>나이</th>
                      <th>지역</th>
                      <th>비고</th>
                    </tr>
                  </thead>
                  
            <tbody className="table-body">
              {memberData.map((member) => (
                <tr key={member.id}>
                  <td>
                    <CFormCheck
                      checked={memberCheckbox.selectedItems.includes(member.id)}
                      onChange={() => memberCheckbox.handleSelectItem(member.id)} // 개별 선택
                    />
                  </td>
                  <td>{member.registeredDate}</td>
                  <td>{member.name}</td>
                  <td>{member.username}</td>
                  <td>{member.grade}</td>
                  <td>{member.phone}</td>
                  <td>{member.gender}</td>
                  <td>{member.age}</td>
                  <td>{member.region}</td>
                  <td>{member.note}</td>
                </tr>
              ))}
            </tbody>{' '}
            */}
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DiscountList
