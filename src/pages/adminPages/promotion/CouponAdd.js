import { React, useState, useEffect } from 'react'
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
  CCol,
} from '@coreui/react'

import DateRangePicker from '@/components/admin/DateRangePicker'
import { registerCoupon } from '@/apis/promotion/couponApis'
import { searchMember } from '@/apis/member/memberApis'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'

const CouponAdd = () => {
  // ===== 기본 정보 =====
  const [couponName, setCouponName] = useState('')
  const [discountType, setDiscountType] = useState('할인율')
  const [discountValue, setDiscountValue] = useState('')
  const [hasMinOrderPrice, setHasMinOrderPrice] = useState(false)
  const [minOrderPrice, setMinOrderPrice] = useState('')
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // ===== 발급 방식 =====
  const [issueType, setIssueType] = useState('auto') // 'auto' 또는 'code'
  const [couponCode, setCouponCode] = useState('')

  // ===== 자동 발급 - 적용 범위 (회원) =====
  const [memberScopeType, setMemberScopeType] = useState('all') // 'all' 또는 'specific'
  const [memberData, setMemberData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const memberCheckbox = useCheckboxSelection(memberData, 'memberId')

  // ===== 회원 목록 불러오기 =====
  useEffect(() => {
    // 자동 발급 + 특정 회원일 때만 회원 목록 불러오기
    if (issueType === 'auto' && memberScopeType === 'specific') {
      fetchMembers()
    }
  }, [issueType, memberScopeType])

  const fetchMembers = async () => {
    try {
      const conditions = {
        keyword: searchKeyword || '',
      }
      const response = await searchMember(conditions, { page: 0, size: 100 })

      if (Array.isArray(response)) {
        const formatted = response.map((member) => ({
          memberId: member.memberId,
          loginId: member.loginId,
          name: member.name,
          email: member.email,
          phoneNumber: member.phoneNumber,
        }))
        setMemberData(formatted)
      } else {
        setMemberData([])
      }
    } catch (error) {
      console.error('❌ 회원 목록 조회 실패:', error)
      setMemberData([])
    }
  }

  const handleRegister = async () => {
    // ===== 유효성 검사 =====
    if (!couponName || !discountType || !discountValue || !startDate || !endDate) {
      alert('모든 필수 항목을 입력해주세요!')
      return
    }

    if (issueType === 'code' && !couponCode) {
      alert('쿠폰 코드를 입력해주세요!')
      return
    }

    if (
      issueType === 'auto' &&
      memberScopeType === 'specific' &&
      memberCheckbox.selectedItems.length === 0
    ) {
      alert('발급 대상 회원을 선택해주세요!')
      return
    }

    // ===== 쿠폰 데이터 구성 =====
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

      // ✅ 자동 발급 시 회원 정보 추가
      ...(issueType === 'auto' && {
        memberScope: memberScopeType.toUpperCase(), // 'ALL' 또는 'SPECIFIC'
        memberIds: memberScopeType === 'specific' ? memberCheckbox.selectedItems : [],
      }),
    }

    console.log('📦 쿠폰 등록 최종 전송 데이터:', newCoupon)

    try {
      const couponId = await registerCoupon(newCoupon)
      alert(`쿠폰이 성공적으로 등록되었습니다.\n쿠폰 ID: ${couponId}`)
      // 페이지 초기화 또는 목록으로 이동
    } catch (error) {
      console.error('❌ 쿠폰 등록 실패:', error)
      alert('쿠폰 등록에 실패했습니다.')
    }
  }

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>쿠폰 등록</h3>
      </CRow>

      {/* ===== 기본 정보 ===== */}
      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              {/* 쿠폰 이름 */}
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  쿠폰 이름
                </td>
                <td colSpan="4">
                  <CFormInput
                    className="small-form"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                    placeholder="예: 신규회원 10% 할인 쿠폰"
                  />
                </td>
              </tr>

              {/* 할인 방식 */}
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

                    {/* 할인율 입력 */}
                    {discountType === '할인율' && (
                      <div className="d-flex gap-3 align-items-center">
                        <CInputGroup className="x-small-form">
                          <CFormInput
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            placeholder="할인율"
                          />
                          <CInputGroupText>%</CInputGroupText>
                        </CInputGroup>

                        <CFormInput
                          type="number"
                          value={maxDiscountAmount}
                          onChange={(e) => setMaxDiscountAmount(e.target.value)}
                          placeholder="최대 할인 금액"
                          className="x-small-form"
                        />
                      </div>
                    )}

                    {/* 할인금액 입력 */}
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

              {/* 최소 주문 금액 */}
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

      {/* ===== 사용 정보 ===== */}
      <CCard className="mb-4">
        <CCardHeader>사용 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              {/* 사용 기간 */}
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  사용 기간
                </td>
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

              {/* 발급 방식 */}
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
                        placeholder="쿠폰 코드 입력 (예: WELCOME2024)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-25"
                      />
                    )}
                  </div>
                </td>
              </tr>

              {/* ✅ 자동 발급 - 적용 범위 (회원) */}
              {issueType === 'auto' && (
                <tr>
                  <td className="text-center table-header">적용 범위</td>
                  <td colSpan="4">
                    <div className="d-flex align-items-center gap-4">
                      <CFormCheck
                        type="radio"
                        name="memberScope"
                        value="all"
                        label="전체 회원"
                        checked={memberScopeType === 'all'}
                        onChange={(e) => setMemberScopeType(e.target.value)}
                      />
                      <CFormCheck
                        type="radio"
                        name="memberScope"
                        value="specific"
                        label="특정 회원"
                        checked={memberScopeType === 'specific'}
                        onChange={(e) => setMemberScopeType(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* ✅ 특정 회원 선택 UI */}
      {issueType === 'auto' && memberScopeType === 'specific' && (
        <CCard className="mb-4">
          <CCardHeader>발급 대상 회원 선택</CCardHeader>
          <CCardBody>
            {/* 회원 검색 */}
            <CRow className="mb-3">
              <CCol md="6">
                <div className="d-flex gap-2">
                  <CFormInput
                    placeholder="회원 이름, ID, 이메일로 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <CButton color="primary" onClick={fetchMembers}>
                    검색
                  </CButton>
                </div>
              </CCol>
            </CRow>

            {/* 선택된 회원 수 */}
            <CRow className="mb-2">
              <CCol>
                <span className="fw-bold">
                  선택된 회원: {memberCheckbox.selectedItems.length}명
                </span>
              </CCol>
            </CRow>

            {/* 회원 목록 테이블 */}
            <table className="table">
              <thead className="table-head">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        memberData.length > 0 &&
                        memberCheckbox.selectedItems.length === memberData.length
                      }
                      onChange={memberCheckbox.handleSelectAll}
                    />
                  </th>
                  <th>No</th>
                  <th>회원ID</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>전화번호</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {memberData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      회원이 없습니다. 검색 버튼을 눌러주세요.
                    </td>
                  </tr>
                ) : (
                  memberData.map((member, index) => (
                    <tr key={member.memberId}>
                      <td>
                        <input
                          type="checkbox"
                          checked={memberCheckbox.selectedItems.includes(member.memberId)}
                          onChange={() => memberCheckbox.handleSelectItem(member.memberId)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{member.loginId}</td>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.phoneNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      )}

      {/* ===== 저장 버튼 ===== */}
      <div className="button-group d-flex justify-content-center gap-2 mt-3">
        <CButton color="primary" onClick={handleRegister}>
          저장
        </CButton>
        <CButton color="secondary" onClick={() => window.history.back()}>
          취소
        </CButton>
      </div>
    </div>
  )
}

export default CouponAdd
