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
import React, { useState } from 'react'
import EditorBox from '@/components/admin/product/EditorBox'
import UploadFile from '@/components/admin/product/UploadFile'

const ProductAdd = () => {
  const [selectedValue, setSelectedValue] = useState('')
  const [supplyPrice, setSupplyPrice] = useState(0)
  const [marginRate, setMarginRate] = useState(0)
  const [additionalAmount, setAdditionalAmount] = useState(0)
  const [taxRate, setTaxRate] = useState(10)
  const [finalPrice, setFinalPrice] = useState(null)
  const [productPrice, setProductPrice] = useState(null)
  const [taxAmount, setTaxAmount] = useState(null)

  const handleRadioChange = (event) => {
    //과세구분에서 과세상품 선택 시 과세율 박스 띄우기
    setSelectedValue(event.target.value)
  }

  const handleCalculation = () => {
    const taxDecimal = taxRate / 100
    const sellingPrice = supplyPrice + (supplyPrice * marginRate) / 100 + additionalAmount
    const productPrice = sellingPrice / (1 + taxDecimal)
    const taxAmount = productPrice * taxDecimal

    setFinalPrice(sellingPrice.toFixed(2))
    setProductPrice(productPrice.toFixed(2))
    setTaxAmount(taxAmount.toFixed(2))
  }

  return (
    <div className="container mt-4">
      <h3>상품 등록</h3>
      <CCard className="mb-4">
        <CCardHeader>표시 설정</CCardHeader>
        <CCardBody>
          {/* 표시 상태 선택 */}
          <div>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>판매상태</CFormLabel>
                <div>
                  <CFormCheck
                    type="radio"
                    name="saleStatus"
                    value="T"
                    label="판매함"
                    checked={selectedValue === 'T'}
                    onChange={handleRadioChange}
                  />
                  <CFormCheck
                    type="radio"
                    name="saleStatus"
                    value="F"
                    label="판매안함"
                    checked={selectedValue === 'F'}
                    onChange={handleRadioChange}
                  />
                </div>
              </CCol>
              <CCol>
                <CFormLabel>진열상태</CFormLabel>
                <div>
                  <CFormCheck type="radio" name="displayStatus" value="T" label="진열함" />
                  <CFormCheck type="radio" name="displayStatus" value="F" label="진열안함" />
                </div>
              </CCol>
              <CCol>
                <CFormLabel>표시제한</CFormLabel>
                <div>
                  <CFormCheck type="radio" name="visibility" value="all" label="모두 표시" />
                  <CFormCheck type="radio" name="visibility" value="customer" label="회원만 표시" />
                </div>
              </CCol>
            </CRow>
          </div>

          {/* 카테고리 선택 */}
          <div>
            <h6>카테고리 선택</h6>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>대분류</CFormLabel>
                <CFormSelect onChange={() => setSelectCategory()}>
                  <option>선택</option>
                  <option value="a">a</option>
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormLabel>중분류</CFormLabel>
                <CFormSelect onChange={() => setSelectCategory()}>
                  <option>선택</option>
                  <option value="a">a</option>
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormLabel>소분류</CFormLabel>
                <CFormSelect onChange={() => setSelectCategory()}>
                  <option>선택</option>
                  <option value="a">a</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>

          {/* 메인 진열 선택 */}
          <div>
            <h6>메인 진열 선택</h6>
            <div className="mb-3">
              <CFormCheck id="new" label="신상품" />
              <CFormCheck label="추천상품" />
              <CFormCheck label="Label" />
              <CFormCheck label="Label" />
            </div>
          </div>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center" style={{ width: '15%' }}>
                  상품명
                </td>
                <td>
                  <CFormInput size="sm" placeholder="상품명을 입력하세요" />
                </td>
                <td className="text-center" style={{ width: '15%' }}>
                  영문 상품명
                </td>
                <td>
                  <CFormInput size="sm" placeholder="영문 상품명을 입력하세요" />
                </td>
              </tr>
              <tr>
                <td className="text-center">모델명</td>
                <td>
                  <CFormInput size="sm" placeholder="모델명을 입력하세요" />
                </td>
                <td className="text-center">상품코드</td>
                <td>
                  <CFormInput size="sm" placeholder="상품코드를 입력하세요" />
                </td>
              </tr>
              <tr>
                <td className="text-center">상품 요약 설명</td>
                <td colSpan="3">
                  <CFormTextarea size="sm" placeholder="상품 요약 설명을 입력하세요" rows="2" />
                </td>
              </tr>
              <tr>
                <td className="text-center">상품 간략 설명</td>
                <td colSpan="3">
                  <CFormTextarea size="sm" placeholder="상품 간략 설명을 입력하세요" rows="2" />
                </td>
              </tr>
              <tr>
                <td className="text-center">상품 상세 설명</td>
                <td colSpan="3">
                  <EditorBox />
                </td>
              </tr>
              <tr>
                <td className="text-center">검색어 설정</td>
                <td colSpan="3">
                  <CFormInput size="sm" placeholder="검색어를 입력하세요" />
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>판매 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center" style={{ width: '15%' }}>
                  소비자가
                </td>
                <td>
                  <CFormInput size="sm" type="number" placeholder="소비자가 입력" />
                </td>
                <td className="text-center" style={{ width: '15%' }}>
                  공급가
                </td>
                <td>
                  <CFormInput
                    size="sm"
                    type="number"
                    value={supplyPrice}
                    onChange={(e) => setSupplyPrice(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center">과세 구분</td>
                <td colSpan="3">
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-row">
                      <CFormCheck
                        type="radio"
                        name="taxGroup"
                        value="과세상품"
                        label="과세상품"
                        onChange={handleRadioChange}
                        defaultChecked={selectedValue === '과세상품'}
                      />
                      <CFormCheck
                        type="radio"
                        name="taxGroup"
                        value="영세상품"
                        label="영세상품"
                        onChange={handleRadioChange}
                        defaultChecked={selectedValue === '영세상품'}
                      />
                      <CFormCheck
                        type="radio"
                        name="taxGroup"
                        value="면세상품"
                        label="면세상품"
                        onChange={handleRadioChange}
                        defaultChecked={selectedValue === '면세상품'}
                      />
                    </div>
                    {selectedValue === '과세상품' && (
                      <CFormInput
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        endText="%"
                        className="mt-2"
                      />
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center">판매가 계산</td>
                <td>
                  <CFormInput
                    size="sm"
                    label="마진율"
                    type="number"
                    value={marginRate}
                    onChange={(e) => setMarginRate(Number(e.target.value))}
                  />
                </td>
                <td>
                  <CFormInput
                    size="sm"
                    label="추가금액"
                    type="number"
                    value={additionalAmount}
                    onChange={(e) => setAdditionalAmount(Number(e.target.value))}
                  />
                </td>
                <td>
                  <CButton color="primary" variant="outline" onClick={handleCalculation}>
                    판매가 계산
                  </CButton>
                </td>
              </tr>
              <tr>
                <td className="text-center">판매가</td>
                <td colSpan="3">
                  {finalPrice !== null && (
                    <>
                      판매가: {finalPrice} 원, 상품가: {productPrice} 원, 과세금액: {taxAmount} 원
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="text-center">적립금</td>
                <td colSpan="3"></td>
              </tr>
              <tr>
                <td className="text-center">할인혜택</td>
                <td colSpan="3"></td>
              </tr>
              <tr>
                <td className="text-center">옵션/재고</td>
                <td colSpan="3"></td>
              </tr>
              <tr>
                <td className="text-center">이미지 등록</td>
                <td colSpan="3">
                  <div>
                    <p>*상품 대표 사진 등록 (1장)</p>
                    <UploadFile maxImages={1} />
                    <p className="mt-3">*상품 추가 사진 등록 (최대 10장)</p>
                    <UploadFile maxImages={10} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProductAdd
