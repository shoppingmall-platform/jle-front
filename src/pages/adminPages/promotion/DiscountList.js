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
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { getDiscountList, deleteDiscount } from '@/apis/product/discountApis'

const DiscountList = () => {
  const [referenceDate, setReferenceDate] = useState('시작일') // 기본값: "시작일"
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [discountName, setDiscountName] = useState('')
  const [discountList, setDiscountList] = useState([])

  const handleSearch = async () => {
    const params = {
      referenceDate,
      startDate,
      endDate,
      discountName: discountName === '' ? null : discountName, // 선택값
    }
    const data = await getDiscountList(params)
    setDiscountList(data)
  }

  const handleDelete = async () => {
    if (discountCheckbox.selectedItems.length === 0) {
      alert('삭제할 항목을 선택해주세요!')
      return
    }

    try {
      for (const discountId of discountCheckbox.selectedItems) {
        await deleteDiscount({ discountId }) // 개별 삭제 요청
      }

      alert('삭제가 완료되었습니다.')

      discountCheckbox.handleDeleteSelected() // 선택 초기화
    } catch (error) {
      console.error('삭제 중 오류 발생:', error)
      alert('삭제에 실패했습니다.')
    }

    handleSearch()
  }

  const handleReferenceDateChange = (event) => {
    console.log('event.target.value', event.target.value)
    setReferenceDate(event.target.value)
  }

  const discountCheckbox = useCheckboxSelection(discountList, 'discountId')

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
                    {/* 시작일/종료일 선택 */}
                    <CFormSelect
                      className="small-select"
                      value={referenceDate}
                      onChange={handleReferenceDateChange}
                    >
                      <option value="시작일">시작일</option>
                      <option value="종료일">종료일</option>
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
                  <CFormInput
                    className="small-form"
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                  />
                </td>

                {/* <td className="text-center table-header">입력코드</td>
                <td colSpan="2">
                  <CFormInput className="small-form" />
                </td> */}
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
                <span className="fw-bold">총 {discountList.length}개</span>
              </CCol>
              {/* <CCol md="6" className="d-flex justify-content-end gap-2">
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>10개씩 보기</option>
                  <option>20개씩 보기</option>
                  <option>50개씩 보기</option>
                </CFormSelect>
              </CCol> */}
            </CRow>
          </div>
          <div className="body-section">
            <CButton className="custom-button" onClick={handleDelete}>
              삭제
            </CButton>
          </div>
          <table className="table">
            <thead className="table-head">
              <tr>
                <th>
                  <CFormCheck
                    checked={discountCheckbox.selectedItems.length === discountList.length}
                    onChange={discountCheckbox.handleSelectAll} // 전체 선택
                  />
                </th>
                <th>할인 ID</th>
                <th>할인 코드</th>
                <th>할인타입</th>
                <th>할인값</th>
                <th>시작일</th>
                <th>종료일</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {discountList.map((discount) => (
                <tr key={discount.discountId}>
                  <td>
                    <CFormCheck
                      checked={discountCheckbox.selectedItems.includes(discount.discountId)}
                      onChange={() => discountCheckbox.handleSelectItem(discount.discountId)} // 개별 선택
                    />
                  </td>
                  <td>{discount.discountId}</td>
                  <td>{discount.discountName}</td>
                  <td>{discount.discountType}</td>
                  <td>{discount.discountValue}</td>
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
