import {
  CButton,
  CForm,
  CFormInput,
  CFormCheck,
  CFormSelect,
  CFormLabel,
  CTable,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
} from '@coreui/react'

import DateRangePicker from '@/components/admin/DateRangePicker'
import { React, useState, useEffect } from 'react'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { searchMember } from '@/apis/member/memberApis'

const CustomerList = () => {
  const [startDate1, setStartDate1] = useState(null)
  const [endDate1, setEndDate1] = useState(null)
  const [startDate2, setStartDate2] = useState(null)
  const [endDate2, setEndDate2] = useState(null)

  const [memberData, setMemberData] = useState([])

  // 검색 조건 상태
  const [searchField, setSearchField] = useState('name')
  const [keyword, setKeyword] = useState('')
  const [level, setLevel] = useState('')
  const [gender, setGender] = useState('')

  const fetchMemberData = async () => {
    const conditions = {
      name: searchField === 'name' ? keyword : null,
      email: searchField === 'email' ? keyword : null,
      level: level || null,
      gender: gender || null,
      dateSearch: 'JOIN',
      startDate: startDate1 ? startDate1.toISOString().slice(0, 10) : null,
      endDate: endDate1 ? endDate1.toISOString().slice(0, 10) : null,
      orderSearch: 'TOTAL_ORDER_AMOUNT',
      orderSearchStartValue: 0,
      orderSearchEndValue: 0,
      orderDateSearch: 'ORDER_DATE',
      startOrderDate: startDate2 ? startDate2.toISOString().slice(0, 10) : null,
      endOrderDate: endDate2 ? endDate2.toISOString().slice(0, 10) : null,
      productId: 0,
    }

    try {
      const data = await searchMember(conditions)
      setMemberData(data)
    } catch (error) {
      console.error('회원 검색 오류:', error)
    }
  }

  const handleSearchClick = () => {
    fetchMemberData()
  }

  const memberCheckbox = useCheckboxSelection(memberData, 'memberId')

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>회원 조회</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>회원 정보 조회</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">개인정보</td>
                <td colSpan="5">
                  <div className="d-flex gap-3">
                    <CFormSelect
                      className="small-select"
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value)}
                    >
                      <option value="name">이름</option>
                      <option value="email">이메일</option>
                    </CFormSelect>
                    <CFormInput
                      size="sm"
                      placeholder="검색어를 입력하세요"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">회원등급</td>
                <td colSpan="2">
                  <CFormSelect value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="">전체</option>
                    <option value="GENERAL">일반 회원</option>
                    <option value="NEW">신규 회원</option>
                    <option value="VIP">VIP 회원</option>
                  </CFormSelect>
                </td>
                <td className="text-center table-header">성별</td>
                <td colSpan="2">
                  <div className="radio-group">
                    <CFormCheck
                      type="radio"
                      name="gender"
                      value=""
                      label="전체"
                      checked={gender === ''}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <CFormCheck
                      type="radio"
                      name="gender"
                      value="M"
                      label="남"
                      checked={gender === 'M'}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <CFormCheck
                      type="radio"
                      name="gender"
                      value="F"
                      label="여"
                      checked={gender === 'F'}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">가입일</td>
                <td colSpan="5">
                  <div className="d-flex gap-3">
                    <DateRangePicker
                      startDate={startDate1}
                      endDate={endDate1}
                      setStartDate={setStartDate1}
                      setEndDate={setEndDate1}
                      showButtons={false}
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">주문일</td>
                <td colSpan="5">
                  <div className="d-flex gap-3">
                    <DateRangePicker
                      startDate={startDate2}
                      endDate={endDate2}
                      setStartDate={setStartDate2}
                      setEndDate={setEndDate2}
                      showButtons={false}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <div className="button-group">
        <CButton color="primary" onClick={handleSearchClick}>
          검색
        </CButton>
      </div>

      <CCard className="mb-4">
        <CCardHeader>회원 목록</CCardHeader>
        <CCardBody>
          <div className="body-section">
            <CRow className="align-items-center">
              <CCol md="6">
                <span className="fw-bold">총 {memberData.length}명</span>
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
          <div className="body-section my-2">
            <CButton className="custom-button">불량회원 설정</CButton>
            <CButton className="custom-button">탈퇴/삭제</CButton>
          </div>
          <CTable>
            <thead className="table-head">
              <tr>
                <th>
                  <CFormCheck
                    checked={memberCheckbox.selectedItems.length === memberData.length}
                    onChange={memberCheckbox.handleSelectAll}
                  />
                </th>
                <th>등록일</th>
                <th>이름</th>
                <th>아이디</th>
                <th>등급</th>
                <th>전화번호</th>
                <th>성별</th>
                <th>생년월일</th>
                <th>상태</th>
              </tr>
            </thead>
            <CTableBody>
              {memberData.map((member) => (
                <CTableRow key={member.memberId}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={memberCheckbox.selectedItems.includes(member.memberId)}
                      onChange={() => memberCheckbox.handleSelectItem(member.memberId)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{member.createAt?.slice(0, 10)}</CTableDataCell>
                  <CTableDataCell>{member.name}</CTableDataCell>
                  <CTableDataCell>{member.memberId}</CTableDataCell>
                  <CTableDataCell>{member.level}</CTableDataCell>
                  <CTableDataCell>{member.phoneNumber}</CTableDataCell>
                  <CTableDataCell>{member.gender}</CTableDataCell>
                  <CTableDataCell>{member.birthday}</CTableDataCell>
                  <CTableDataCell>{member.status}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default CustomerList
