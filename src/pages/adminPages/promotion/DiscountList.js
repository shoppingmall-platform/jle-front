import { React, useState, useEffect } from 'react'
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
import { getDiscountList } from '@/apis/product/discountApis'

const DiscountList = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [discountList, setDiscountList] = useState([])

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert('시작일과 종료일을 선택해주세요!')
      return
    }
    const data = await getDiscountList(startDate, endDate)
    setDiscountList(data)
  }

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
        <CButton color="primary" onClick={handleSearch}>
          검색
        </CButton>
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
            <thead className="table-head">
              <tr>
                {/* <th>
                        <CFormCheck
                          checked={memberCheckbox.selectedItems.length === memberData.length}
                          onChange={memberCheckbox.handleSelectAll} // 전체 선택
                        />
                      </th> */}
                <th>할인 ID</th>
                <th>할인 코드</th>
                <th>할인율</th>
                <th>최대할인금액</th>
                <th>시작일</th>
                <th>종료일</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {discountList.map((discount) => (
                <tr key={discount.discountId}>
                  {/* <td>
                    <CFormCheck
                      checked={memberCheckbox.selectedItems.includes(member.id)}
                      onChange={() => memberCheckbox.handleSelectItem(member.id)} // 개별 선택
                    />
                  </td> */}
                  <td>{discount.discountId}</td>
                  <td>{discount.discountName}</td>
                  <td>{discount.discountPercentage}</td>
                  <td>{discount.discountPrice}</td>
                  <td>{discount.discountStartDate}</td>
                  <td>{discount.discountEndDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DiscountList
