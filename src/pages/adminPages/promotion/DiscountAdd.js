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

const DiscountAdd = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>할인 등록</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">할인코드 입력</td>
                <td colSpan="4">
                  <CFormInput className="small-form" />
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">입력코드</td>
                <td colSpan="4">
                  <div className="d-flex gap-3">
                    <CFormInput className="small-form" />
                    <CButton color="primary" variant="outline">
                      확인
                    </CButton>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header ">혜택구분</td>
                <td colSpan="4">
                  <div className="d-flex gap-3">
                    할인율
                    <CInputGroup className="x-small-form">
                      <CFormInput label="" type="number" />
                      <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                    <CFormSelect className="small-select" label="절사단위">
                      <option>절사안함</option>
                      <option>10</option>
                      <option>100</option>
                      <option>1000</option>
                    </CFormSelect>
                    상품당 최대 할인 금액
                    <CInputGroup className="x-small-form">
                      <CFormInput label="" type="number" />
                      <CInputGroupText>원</CInputGroupText>
                    </CInputGroup>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>사용 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">사용기간</td>
                <td colSpan="4">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    showButtons={true}
                    includeTime={true}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">적용범위</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="적용범위" value="1" label="전체 상품" />
                    <CFormCheck type="radio" name="적용범위" value="2" label="특정 상품" />
                    <CFormCheck type="radio" name="적용범위" value="3" label="특정 분류" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>제한 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">사용가능 대상</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="사용가능 대상" value="1" label="제한안함" />
                    <CFormCheck type="radio" name="사용가능 대상" value="2" label="제한함" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">최대사용 가능횟수</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="최대사용 가능횟수" value="1" label="제한안함" />
                    <CFormCheck type="radio" name="최대사용 가능횟수" value="2" label="제한함" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">사용가능 최소 주문금액</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck
                      type="radio"
                      name="사용가능 최소 주문금액"
                      value="1"
                      label="제한안함"
                    />
                    <CFormCheck
                      type="radio"
                      name="사용가능 최소 주문금액"
                      value="2"
                      label="제한함"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group">
        <CButton color="primary">저장 </CButton>
      </div>
    </div>
  )
}

export default DiscountAdd
