import {
  CButton,
  CForm,
  CFormInput,
  CFormCheck,
  CFormSelect,
  CFormLabel,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormTextarea,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons' // 아이콘 불러오기
import CIcon from '@coreui/icons-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { React, useState, useEffect } from 'react'
import '../adminpage.css'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'

const data = {
  total: 5, // 전체 건수
  sold: 3, // 판매된 건수
  unsold: 2, // 판매되지 않은 건수
}

const ProductList = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [productData, setProductData] = useState([])

  const fetchProductData = async () => {
    try {
      const productDatas = [
        {
          productCode: '12345',
          productName: '상품 A',
          salePrice: '10,000원',
          discountPrice: '9,000원',
          category: '일반상품',
          note: '-',
        },
        {
          productCode: '67890',
          productName: '상품 B',
          salePrice: '20,000원',
          discountPrice: '18,000원',
          category: '세트상품',
          note: '-',
        },
        {
          productCode: '11223',
          productName: '상품 C',
          salePrice: '30,000원',
          discountPrice: '27,000원',
          category: '할인상품',
          note: '-',
        },
      ]
      setProductData(productDatas)
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    fetchProductData()
  }, [])
  const productCheckbox = useCheckboxSelection(productData, 'productCode')

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>상품 목록</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardBody>
          <div>
            <CRow>
              <div
                style={{
                  justifyContent: 'flex-start',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <span>전체: {data.total}건</span>
                <span>판매함: {data.sold}건</span>
                <span>판매안함: {data.unsold}건</span>
              </div>
            </CRow>
          </div>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>상품 검색</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  검색분류
                </td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol className="flex-row">
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>상품명</option>
                        <option value="a">a</option>
                      </CFormSelect>
                      <CFormInput size="sm" placeholder="검색어를 입력하세요" />
                      <CButton
                        size="sm"
                        // onClick={handleSearch}
                        className="ms-2"
                        aria-label="검색"
                      >
                        <CIcon icon={cilSearch} />
                      </CButton>
                    </CCol>
                  </CRow>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">카테고리</td>
                <td colSpan="7">
                  <CRow className="m-1">
                    <CCol>
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>대분류 선택</option>
                        <option value="a">a</option>
                      </CFormSelect>
                    </CCol>
                    <CCol>
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>중분류 선택</option>
                        <option value="a">a</option>
                      </CFormSelect>
                    </CCol>
                    <CCol>
                      <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                        <option>소분류 선택</option>
                        <option value="a">a</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">상품 등록일</td>
                <td colSpan="7">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CButton
                      className="custom-button"
                      onClick={() => {
                        const today = new Date()
                        setStartDate(today)
                        setEndDate(today)
                      }}
                    >
                      오늘
                    </CButton>

                    <CButton
                      className="custom-button"
                      onClick={() => {
                        const today = new Date()
                        setStartDate(new Date(today.setDate(today.getDate() - 3)))
                        setEndDate(new Date())
                      }}
                    >
                      3일
                    </CButton>

                    <CButton
                      className="custom-button"
                      onClick={() => {
                        const today = new Date()
                        setStartDate(new Date(today.setDate(today.getDate() - 7)))
                        setEndDate(new Date())
                      }}
                    >
                      7일
                    </CButton>

                    <CButton
                      className="custom-button"
                      onClick={() => {
                        const today = new Date()
                        setStartDate(new Date(today.setMonth(today.getMonth() - 1)))
                        setEndDate(new Date())
                      }}
                    >
                      1개월
                    </CButton>

                    <CButton
                      className="custom-button"
                      onClick={() => {
                        const today = new Date()
                        setStartDate(new Date(today.setMonth(today.getMonth() - 3)))
                        setEndDate(new Date())
                      }}
                    >
                      3개월
                    </CButton>

                    <CButton
                      className="custom-button"
                      onClick={() => {
                        setStartDate(null)
                        setEndDate(null)
                      }}
                    >
                      전체
                    </CButton>

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
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">진열상태</td>
                <td colSpan="7">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="saleStatus" value="T" label="전체" />
                    <CFormCheck type="radio" name="saleStatus" value="T" label="진열함" />
                    <CFormCheck type="radio" name="saleStatus" value="F" label="진열안함" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">판매상태</td>
                <td colSpan="7">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="saleStatus" value="T" label="전체" />
                    <CFormCheck type="radio" name="saleStatus" value="T" label="판매함" />
                    <CFormCheck type="radio" name="saleStatus" value="F" label="판매안함" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group">
        <CButton color="primary">검색</CButton>
        <CButton color="primary">초기화</CButton>
      </div>
      <CCard>
        <CCardHeader>상품 목록</CCardHeader>
        <CCardBody>
          <div className="body-section">
            <CRow className="align-items-center">
              <CCol md="6">
                <span className="fw-bold">총 0개</span>
              </CCol>
              <CCol md="6" className="d-flex justify-content-end gap-2">
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>등록일 순</option>
                  <option>상품명 순</option>
                </CFormSelect>
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>10개씩 보기</option>
                  <option>20개씩 보기</option>
                  <option>50개씩 보기</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>
          <div className="body-section">
            <CButton className="custom-button">진열함</CButton>
            <CButton className="custom-button">진열안함</CButton>
            <CButton className="custom-button">판매함</CButton>
            <CButton className="custom-button">판매안함</CButton>
            <CButton className="custom-button">삭제</CButton>
            <CButton className="custom-button">복사</CButton>
          </div>
          <table className="table">
            {/* 표의 헤더 */}
            <thead className="table-head">
              <tr>
                <th>
                  <CFormCheck
                    checked={productCheckbox.selectedItems.length === productData.length}
                    onChange={productCheckbox.handleSelectAll} // 전체 선택
                  />
                </th>
                <th>No</th>
                <th>상품구분</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>판매가</th>
                <th>할인가</th>
                <th>비고</th>
              </tr>
            </thead>
            {/* 표의 본문 */}
            <tbody className="table-body">
              {productData.map((product, index) => (
                <tr key={product.productCode}>
                  <td>
                    <CFormCheck
                      checked={productCheckbox.selectedItems.includes(product.productCode)}
                      onChange={() => productCheckbox.handleSelectItem(product.productCode)} // 개별 선택
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{product.category}</td>
                  <td>{product.productCode}</td>
                  <td>{product.productName}</td>
                  <td>{product.salePrice}</td>
                  <td>{product.discountPrice}</td>
                  <td>{product.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProductList
