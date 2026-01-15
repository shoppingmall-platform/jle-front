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

    if (
      !window.confirm(`선택한 ${discountCheckbox.selectedItems.length}개 항목을 삭제하시겠습니까?`)
    ) {
      return
    }

    try {
      console.log('🗑️ 삭제 요청:', discountCheckbox.selectedItems)

      const failedDeletes = []

      for (const discountId of discountCheckbox.selectedItems) {
        try {
          await deleteDiscount({ discountId })
        } catch (error) {
          // 외래키 제약 조건 에러 확인
          const isForeignKeyError =
            error.response?.data?.errorInfo?.includes('foreign key constraint')

          if (isForeignKeyError) {
            // 🔥 사용 중인 할인코드 - 강제 삭제 확인
            const forceDelete = window.confirm(
              `⚠️ 할인코드 ID ${discountId}는 과거 주문에서 사용된 이력이 있습니다.\n\n` +
                `(만료된 할인이어도 주문 이력이 남아있으면 삭제할 수 없습니다)\n\n` +
                `강제로 삭제하시겠습니까?\n` +
                `→ 관련된 주문 할인 정보도 함께 삭제됩니다.`,
            )

            if (forceDelete) {
              try {
                // 강제 삭제 API 호출
                await deleteDiscount({ discountId, force: true })
                console.log(`✅ 할인코드 ${discountId} 강제 삭제 성공`)
              } catch (forceError) {
                failedDeletes.push(discountId)
                console.error(`❌ 할인코드 ${discountId} 강제 삭제 실패:`, forceError)
              }
            } else {
              failedDeletes.push(discountId)
            }
          } else {
            failedDeletes.push(discountId)
            console.error(`❌ 할인코드 ${discountId} 삭제 실패:`, error)
          }
        }
      }

      console.log('✅ 삭제 완료')

      // 결과에 따라 다른 메시지 표시
      if (failedDeletes.length === 0) {
        alert('삭제가 완료되었습니다.')
      } else if (failedDeletes.length === discountCheckbox.selectedItems.length) {
        alert('삭제가 취소되었습니다.')
        return // 재조회 하지 않음
      } else {
        alert(`일부 항목이 삭제되었습니다.\n\n삭제 실패: ${failedDeletes.length}개`)
      }

      // ✅ 삭제 성공 후 재조회
      await handleSearch()

      // ✅ 선택 초기화
      discountCheckbox.handleDeleteSelected()
    } catch (error) {
      console.error('❌ 삭제 중 오류 발생:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
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
                <th>상태</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {discountList.map((discount) => {
                // 현재 시간과 종료일 비교
                const now = new Date()
                const endDate = new Date(discount.discountEndDate)
                const isExpired = endDate < now

                return (
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
                    <td>
                      {isExpired ? (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>만료됨</span>
                      ) : (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>진행중</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DiscountList
