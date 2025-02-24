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
import { registerDiscount } from '@/apis/product/discountApis'

const DiscountAdd = () => {
  const [discountName, setDiscountName] = useState('')
  const [discountType, setDiscountType] = useState('할인율')
  const [discountValue, setDiscountValue] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!discountName || !discountType || !discountValue || !startDate || !endDate) {
      alert('모든 필수 항목을 입력해주세요!')
      return
    }

    const newDiscount = {
      discountName,
      discountType,
      discountValue: Number(discountValue),
      discountStartDate: new Date(startDate).toISOString(),
      discountEndDate: new Date(endDate).toISOString(),
      // 상품타입: '전체상품' or '선택상품' or '특정분류',
      // productValue: ['productID1, productID2 ....']
    }

    setLoading(true)
    try {
      await registerDiscount(newDiscount)
      alert('할인이 성공적으로 등록되었습니다!')
    } catch (error) {
      alert('할인 등록 실패: ' + (error.response?.data?.message || '알 수 없는 오류'))
    } finally {
      setLoading(false)
    }
  }

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
                  <CFormInput
                    className="small-form"
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center table-header ">혜택구분</td>
                <td colSpan="4">
                  <div className="d-flex gap-3">
                    <div className="radio-group">
                      <CFormCheck
                        type="radio"
                        name="혜택구분"
                        value="할인율"
                        label="할인율"
                        checked={discountType === '할인율'}
                        onChange={(e) => {
                          setDiscountType(e.target.value)
                          setDiscountValue('') // 타입 변경 시 값 초기화
                        }}
                      />
                      <CFormCheck
                        type="radio"
                        name="혜택구분"
                        value="할인금액"
                        label="할인금액"
                        checked={discountType === '할인금액'}
                        onChange={(e) => {
                          setDiscountType(e.target.value)
                          setDiscountValue('') // 타입 변경 시 값 초기화
                        }}
                      />
                    </div>
                    {discountType === '할인율' && (
                      <CInputGroup className="x-small-form">
                        <CFormInput
                          type="number"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                        />
                        <CInputGroupText>%</CInputGroupText>
                      </CInputGroup>
                    )}

                    {discountType === '할인금액' && (
                      <CInputGroup className="x-small-form">
                        <CFormInput
                          type="number"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                        />
                        <CInputGroupText>원</CInputGroupText>
                      </CInputGroup>
                    )}
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
      <div className="button-group">
        <CButton color="primary" onClick={handleRegister}>
          저장{' '}
        </CButton>
      </div>
    </div>
  )
}

export default DiscountAdd
