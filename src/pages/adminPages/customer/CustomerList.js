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
  CFormTextarea,
} from '@coreui/react'
import '../adminpage.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { React, useState, useEffect } from 'react'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'

const CustomerList = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [memberData, setMemberData] = useState([])

  const fetchMemberData = async () => {
    try {
      const members = [
        {
          id: 'M001',
          registeredDate: '2024-02-01',
          name: '김철수',
          username: 'chulsoo123',
          grade: 'VIP',
          phone: '010-1234-5678',
          gender: '남',
          age: 30,
          region: '서울',
          note: '-',
        },
        {
          id: 'M002',
          registeredDate: '2024-01-20',
          name: '이영희',
          username: 'younghee99',
          grade: '일반',
          phone: '010-5678-1234',
          gender: '여',
          age: 28,
          region: '부산',
          note: '쿠폰 사용',
        },
        {
          id: 'M003',
          registeredDate: '2023-12-15',
          name: '박민준',
          username: 'minjun456',
          grade: '프리미엄',
          phone: '010-9876-5432',
          gender: '남',
          age: 35,
          region: '대구',
          note: '문의 요청',
        },
      ]
      setMemberData(members)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    fetchMemberData()
  }, [])

  const memberCheckbox = useCheckboxSelection(memberData, 'id')

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
                <td className="text-center table-header" style={{ width: '15%' }}>
                  개인정보
                </td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>아이디</option>
                        <option value="a">a</option>
                      </CFormSelect>
                      <CFormInput size="sm" placeholder="검색어를 입력하세요" />
                    </CCol>
                  </CRow>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  회원등급
                </td>
                <td style={{ width: '35%' }}>
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>전체</option>
                        <option value="a">일반회원</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </td>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  회원유형
                </td>
                <td style={{ width: '35%', verticalAlign: 'middle' }}>
                  <div className="radio-group">
                    <CFormCheck type="radio" name="saleStatus" value="T" label="전체" />
                    <CFormCheck type="radio" name="saleStatus" value="T" label="특별관리유형" />
                    <CFormCheck type="radio" name="saleStatus" value="F" label="불량유형" />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  가입일/기념일
                </td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>가입일</option>
                        <option value="a">생일</option>
                      </CFormSelect>

                      <div>
                        <DatePicker
                          showIcon
                          dateFormat="yyyy.MM.dd"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText="시작 날짜"
                          className="custom-datepicker"
                        />

                        <span>~</span>

                        <DatePicker
                          showIcon
                          dateFormat="yyyy.MM.dd"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          placeholderText="종료 날짜"
                          className="custom-datepicker"
                        />
                      </div>
                    </CCol>
                  </CRow>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  나이
                </td>
                <td style={{ width: '35%' }}>
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>전체</option>
                        <option value="a">10대</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </td>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  성별
                </td>
                <td style={{ width: '35%', verticalAlign: 'middle' }}>
                  <div className="radio-group">
                    <CFormCheck type="radio" name="saleStatus" value="T" label="전체" />
                    <CFormCheck type="radio" name="saleStatus" value="T" label="남" />
                    <CFormCheck type="radio" name="saleStatus" value="F" label="여" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  구매금액/건수
                </td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>전체</option>
                        <option value="a">생일</option>
                      </CFormSelect>
                      <CFormInput size="sm" placeholder="" />
                      <span>~</span>
                      <CFormInput size="sm" placeholder="" />
                    </CCol>
                  </CRow>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  주문일/결제완료일
                </td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>주문일</option>
                        <option value="a">결제완료일</option>
                      </CFormSelect>

                      <div>
                        <DatePicker
                          showIcon
                          dateFormat="yyyy.MM.dd"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText="시작 날짜"
                          className="custom-datepicker"
                        />

                        <span>~</span>

                        <DatePicker
                          showIcon
                          dateFormat="yyyy.MM.dd"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          placeholderText="종료 날짜"
                          className="custom-datepicker"
                        />
                      </div>
                    </CCol>
                  </CRow>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  주문상품
                </td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormInput size="sm" style={{ width: '150px' }} placeholder="" />
                      <CButton color="secondary">상품검색 </CButton>
                    </CCol>
                  </CRow>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group">
        <CButton color="primary">검색 </CButton>
      </div>

      <CCard className="mb-4">
        <CCardHeader>회원 목록</CCardHeader>
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
            <CButton className="custom-button">불량회원 설정</CButton>
            <CButton className="custom-button">탈퇴/삭제</CButton>
          </div>
          <table className="table">
            {/* 표의 헤더 */}
            <thead className="table-head">
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
            {/* 표의 본문 */}
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
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default CustomerList
