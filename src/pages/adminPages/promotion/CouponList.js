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
import { getCouponList, deleteCoupon } from '@/apis/product/couponApis'

const CouponList = () => {
  const [couponName, setCouponName] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const [couponList, setCouponList] = useState([
    {
      couponId: 'f78282be-21d8-4af3-a933-b82c84a17bba',
      couponIssueCode: 'WELCOME10',
      issueType: 'AUTO',
      couponName: '신규회원 10% 할인',
      couponType: 'PERCENT',
      discountAmount: 10,
      minOrderPrice: 30000,
      maxDiscountPrice: 1000,
      couponStartDate: '2025-05-01',
      couponEndDate: '2025-06-01',
      comment: '신규회원 전용 쿠폰',
      isIssued: false,
    },
    {
      couponId: 'a12345be-12ab-4abc-9d88-xyz123456789',
      couponIssueCode: 'SAVE5000',
      issueType: 'CODE',
      couponName: '5천원 즉시 할인',
      couponType: 'FIXED',
      discountAmount: 5000,
      minOrderPrice: 50000,
      maxDiscountPrice: 0,
      couponStartDate: '2025-05-10',
      couponEndDate: '2025-06-10',
      comment: '앱 전용 할인 쿠폰',
      isIssued: true,
    },
  ])

  const couponCheckbox = useCheckboxSelection(couponList, 'couponId')

  const handleSearch = async () => {
    const params = {
      couponName: couponName || '', // 빈 문자열이면 전체 검색
      couponStartDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
      couponEndDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
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
      alert('❌ 삭제 중 오류가 발생했습니다.')
    }
  }
  const handleBulkDelete = async () => {
    const idsToDelete = couponCheckbox.selectedItems
    if (idsToDelete.length === 0) return alert('삭제할 항목을 선택해주세요.')

    if (!window.confirm(`${idsToDelete.length}개 쿠폰을 삭제하시겠습니까?`)) return

    try {
      for (const id of idsToDelete) {
        await deleteCoupon(id)
      }

      setCouponList((prev) => prev.filter((c) => !idsToDelete.includes(c.couponId)))
      couponCheckbox.clearSelection()
      alert('✅ 일괄 삭제가 완료되었습니다.')
    } catch (e) {
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
                <th>관리</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {couponList.map((coupon) => (
                <tr key={coupon.couponId}>
                  <td>
                    <CFormCheck
                      checked={couponCheckbox.selectedItems.includes(coupon.couponId)}
                      onChange={() => couponCheckbox.handleSelectItem(coupon.couponId)}
                    />
                  </td>
                  <td>{coupon.couponName}</td>
                  <td>
                    {coupon.couponType === 'PERCENT'
                      ? `${coupon.discountAmount}%`
                      : `${coupon.discountAmount.toLocaleString()}원`}
                  </td>
                  <td>{coupon.couponStartDate}</td>
                  <td>{coupon.couponEndDate}</td>
                  <td>
                    <CButton size="sm" color="info" onClick={() => handleViewDetails(coupon)}>
                      상세보기
                    </CButton>{' '}
                    <CButton size="sm" color="danger" onClick={() => handleDelete(coupon.couponId)}>
                      삭제
                    </CButton>
                  </td>
                </tr>
              ))}
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
              <p>설명: {selectedCoupon.comment}</p>
              <p>발급 여부: {selectedCoupon.isIssued ? '발급됨' : '미발급'}</p>
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
