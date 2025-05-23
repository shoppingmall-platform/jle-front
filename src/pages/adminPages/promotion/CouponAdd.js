import { React, useState } from 'react'
import {
  CButton,
  CFormInput,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CForm,
  CCol,
} from '@coreui/react'

import DateRangePicker from '@/components/admin/DateRangePicker'
import { registerCoupon } from '@/apis/product/couponApis'

const CouponAdd = () => {
  const [issueType, setIssueType] = useState('auto')

  const [couponName, setCouponName] = useState('')
  const [discountType, setDiscountType] = useState('할인율')
  const [discountValue, setDiscountValue] = useState('')
  const [hasMinOrderPrice, setHasMinOrderPrice] = useState(false)
  const [minOrderPrice, setMinOrderPrice] = useState('')
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [couponCode, setCouponCode] = useState('')

  const handleRegister = async () => {
    if (!couponName || !discountType || !discountValue || !startDate || !endDate) {
      alert('모든 필수 항목을 입력해주세요!')
      return
    }
    const newCoupon = {
      couponName,
      couponType: discountType === '할인율' ? 'PERCENT' : 'FIXED',
      amount: Number(discountValue),
      minOrderPrice: hasMinOrderPrice ? Number(minOrderPrice) : 0,
      maxDiscountPrice: discountType === '할인율' ? Number(maxDiscountAmount) : 0,
      couponStartDate: new Date(startDate).toISOString(),
      couponEndDate: new Date(endDate).toISOString(),
      issueType: issueType.toUpperCase(), // 'AUTO' 또는 'CODE'
      couponIssueCode: issueType === 'code' ? couponCode : '',
      comment: '',
    }
    console.log('쿠폰등록 최종 전송 데이터:', newCoupon)

    try {
      const couponId = await registerCoupon(newCoupon)
      alert(`쿠폰이 성공적으로 등록되었습니다.\n쿠폰 ID: ${couponId}`)
    } catch (error) {
      alert('쿠폰 등록에 실패했습니다.')
    }
  }

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>쿠폰 등록</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">쿠폰 이름</td>
                <td colSpan="4">
                  <CFormInput
                    className="small-form"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">할인 방식</td>
                <td colSpan="4">
                  <div className="d-flex gap-3">
                    <CFormCheck
                      type="radio"
                      name="할인방식"
                      value="할인율"
                      label="할인율"
                      checked={discountType === '할인율'}
                      onChange={(e) => {
                        setDiscountType(e.target.value)
                        setDiscountValue('')
                      }}
                    />
                    <CFormCheck
                      type="radio"
                      name="할인방식"
                      value="할인금액"
                      label="할인금액"
                      checked={discountType === '할인금액'}
                      onChange={(e) => {
                        setDiscountType(e.target.value)
                        setDiscountValue('')
                      }}
                    />
                    {discountType === '할인율' && (
                      <div className="d-flex gap-3 align-items-center">
                        {/* 할인율 입력 */}
                        <CInputGroup className="x-small-form">
                          <CFormInput
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            placeholder="할인율"
                          />
                          <CInputGroupText>%</CInputGroupText>
                        </CInputGroup>

                        {/* 최대 할인금액 입력 */}
                        <CFormInput
                          type="number"
                          value={maxDiscountAmount}
                          onChange={(e) => setMaxDiscountAmount(e.target.value)}
                          placeholder="최대 할인 금액"
                          className="x-small-form"
                        />
                      </div>
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

              <tr>
                <td className="text-center table-header">최소 주문 금액</td>
                <td colSpan="4">
                  <div className="d-flex gap-4 align-items-center">
                    <CFormCheck
                      type="radio"
                      name="minOrder"
                      label="없음"
                      checked={!hasMinOrderPrice}
                      onChange={() => {
                        setHasMinOrderPrice(false)
                        setMinOrderPrice('')
                      }}
                    />
                    <div className="d-flex align-items-center gap-2">
                      <CFormCheck
                        type="radio"
                        name="minOrder"
                        label="있음"
                        checked={hasMinOrderPrice}
                        onChange={() => setHasMinOrderPrice(true)}
                      />
                      {hasMinOrderPrice && (
                        <CInputGroup className="w-50">
                          <CFormInput
                            type="number"
                            value={minOrderPrice}
                            onChange={(e) => setMinOrderPrice(e.target.value)}
                          />
                          <CInputGroupText>원 이상</CInputGroupText>
                        </CInputGroup>
                      )}
                    </div>
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
                    mode="future"
                  />
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">발급 방식</td>
                <td colSpan="4">
                  <div className="d-flex align-items-center gap-4">
                    <CFormCheck
                      type="radio"
                      name="issueType"
                      value="auto"
                      label="자동 발급"
                      checked={issueType === 'auto'}
                      onChange={(e) => setIssueType(e.target.value)}
                    />
                    <CFormCheck
                      type="radio"
                      name="issueType"
                      value="code"
                      label="코드 입력"
                      checked={issueType === 'code'}
                      onChange={(e) => setIssueType(e.target.value)}
                    />

                    {issueType === 'code' && (
                      <CFormInput
                        placeholder="쿠폰 코드 입력"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-25"
                      />
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <div className="button-group">
        <CButton color="primary" onClick={handleRegister}>
          저장
        </CButton>
      </div>
    </div>
  )
}

export default CouponAdd
