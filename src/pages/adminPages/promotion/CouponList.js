import { React, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import DateRangePicker from '@/components/admin/DateRangePicker'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { getCouponList, deleteCoupon } from '@/apis/promotion/couponApis'

const CouponList = () => {
  const [couponName, setCouponName] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const [couponList, setCouponList] = useState([])

  const couponCheckbox = useCheckboxSelection(couponList, 'couponId')

  // ⭐ 쿠폰 상태 판별 함수
  const getCouponStatus = (coupon) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const endDate = new Date(coupon.couponEndDate)
    endDate.setHours(23, 59, 59, 999)

    if (endDate < today) {
      return { text: '⏰ 만료됨', color: 'secondary' }
    }

    const startDate = new Date(coupon.couponStartDate)
    startDate.setHours(0, 0, 0, 0)

    if (startDate > today) {
      return { text: '⏳ 대기 중', color: 'warning' }
    }

    return { text: '✅ 사용 가능', color: 'success' }
  }

  const handleSearch = async () => {
    const params = {
      couponName: couponName || '', // 빈 문자열이면 전체 검색
      couponStartDate: startDate,
      couponEndDate: endDate,
    }

    console.log('📤 검색 파라미터:', params)

    const data = await getCouponList(params)
    setCouponList(data)
  }

  const handleViewDetails = (coupon) => {
    setSelectedCoupon(coupon)
    setModalVisible(true)
  }

  const handleDelete = async (couponId) => {
    if (!window.confirm('이 쿠폰을 삭제하시겠습니까?')) return

    try {
      await deleteCoupon(couponId)

      const updated = couponList.filter((c) => c.couponId !== couponId)
      setCouponList(updated)

      alert('✅ 삭제가 완료되었습니다.')
    } catch (err) {
      console.error('쿠폰 삭제 실패:', err)

      // 외래키 제약 조건 에러 체크
      if (
        err.response?.data?.message?.includes('foreign key') ||
        err.response?.data?.message?.includes('constraint') ||
        err.message?.includes('foreign key')
      ) {
        alert(
          '❌ 이 쿠폰을 이미 발급받은 회원이 있어 삭제할 수 없습니다.\n\n회원이 사용하거나 만료될 때까지 기다려주세요.',
        )
      } else {
        alert('❌ 삭제 중 오류가 발생했습니다.\n\n' + (err.response?.data?.message || err.message))
      }
    }
  }

  const handleBulkDelete = async () => {
    const idsToDelete = couponCheckbox.selectedItems
    if (idsToDelete.length === 0) return alert('삭제할 항목을 선택해주세요.')

    if (!window.confirm(`${idsToDelete.length}개 쿠폰을 삭제하시겠습니까?`)) return

    try {
      const failedIds = []

      for (const id of idsToDelete) {
        try {
          await deleteCoupon(id)
        } catch (err) {
          console.error(`쿠폰 ${id} 삭제 실패:`, err)
          failedIds.push(id)
        }
      }

      setCouponList((prev) =>
        prev.filter((c) => !idsToDelete.includes(c.couponId) || failedIds.includes(c.couponId)),
      )
      couponCheckbox.clearSelection()

      if (failedIds.length === 0) {
        alert('✅ 일괄 삭제가 완료되었습니다.')
      } else {
        alert(
          `⚠️ ${idsToDelete.length - failedIds.length}개 삭제 완료\n${failedIds.length}개 삭제 실패\n\n일부 쿠폰은 회원이 발급받아 삭제할 수 없습니다.`,
        )
      }
    } catch (e) {
      console.error('일괄 삭제 실패:', e)
      alert('❌ 일괄 삭제 중 오류 발생')
    }
  }

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>쿠폰 조회</h3>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>쿠폰 검색</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">기간</td>
                <td colSpan="5">
                  <div className="d-flex gap-3">
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
                <td className="text-center table-header">쿠폰명</td>
                <td colSpan="2">
                  <CFormInput
                    className="small-form"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                  />
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
        <CCardHeader>쿠폰 목록</CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol md="6">
              <span className="fw-bold">총 {couponList.length}개</span>
            </CCol>
          </CRow>
          <table className="table">
            <thead className="table-head">
              <tr>
                <th>
                  <CFormCheck
                    checked={couponCheckbox.selectedItems.length === couponList.length}
                    onChange={couponCheckbox.handleSelectAll}
                  />
                </th>
                <th>쿠폰명</th>
                <th>할인</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {couponList.map((coupon) => {
                const status = getCouponStatus(coupon)

                return (
                  <tr key={coupon.couponId}>
                    <td>
                      <CFormCheck
                        checked={couponCheckbox.selectedItems.includes(coupon.couponId)}
                        onChange={() => couponCheckbox.handleSelectItem(coupon.couponId)}
                      />
                    </td>
                    <td>{coupon.couponName}</td>
                    <td>
                      {coupon.couponType === 'RATE' || coupon.couponType === 'PERCENT'
                        ? `${coupon.discountAmount}%`
                        : `${coupon.discountAmount.toLocaleString()}원`}
                    </td>
                    <td>{coupon.couponStartDate}</td>
                    <td>{coupon.couponEndDate}</td>
                    <td>
                      <span className={`badge bg-${status.color}`}>{status.text}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                        onClick={() => handleViewDetails(coupon)}
                      >
                        상세
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                        onClick={() => handleDelete(coupon.couponId)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <CButton color="danger" size="sm" onClick={handleBulkDelete}>
            선택 삭제
          </CButton>
        </CCardBody>
      </CCard>

      {/* 상세보기 모달 */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <strong>쿠폰 상세정보</strong>
        </CModalHeader>
        <CModalBody>
          {selectedCoupon && (
            <div>
              <p>쿠폰 코드: {selectedCoupon.couponIssueCode}</p>
              <p>발급 방식: {selectedCoupon.issueType}</p>
              <p>쿠폰 타입: {selectedCoupon.couponType}</p>
              <p>최소 주문금액: {selectedCoupon.minOrderPrice.toLocaleString()}원</p>
              <p>
                최대 할인금액:{' '}
                {selectedCoupon.maxDiscountPrice
                  ? selectedCoupon.maxDiscountPrice.toLocaleString() + '원'
                  : '-'}
              </p>

              <p>상태: {getCouponStatus(selectedCoupon).text}</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            닫기
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CouponList
