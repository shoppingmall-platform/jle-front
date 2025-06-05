// components/order/AddressSection.jsx
import React, { useEffect, useState } from 'react'
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CAccordionBody,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CButton,
  CModal,
  CModalBody,
  CAlert,
} from '@coreui/react'
import DaumPostcode from 'react-daum-postcode'
import addressApis from '@/apis/member/addressApis'

const AddressSection = ({ onAddressSelected }) => {
  const [activeTab, setActiveTab] = useState(0)

  // 배송지 목록 API 호출
  const [addressList, setAddressList] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  // “더보기” 토글 상태
  const [showAll, setShowAll] = useState(false)

  // 배송메모, “다음에도 사용” 체크박스 상태
  const [deliveryMemo, setDeliveryMemo] = useState('')
  const [useNextTime, setUseNextTime] = useState(false)

  // --- 직접 입력 폼 상태 (AddressAdd에서 가져온 로직을 간소화) ---
  const [alias, setAlias] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)

  // 탭 전환 시 alert 초기화
  useEffect(() => {
    setAlertMsg(null)
  }, [activeTab])

  // 1) 주소 목록 불러오기
  const fetchAddresses = async () => {
    try {
      const data = await addressApis.getMyAddresses()
      setAddressList(data || [])
    } catch (err) {
      console.error(err)
      setFetchError('배송지 정보를 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    if (activeTab === 0) {
      fetchAddresses()
    }
  }, [activeTab])

  // 2) 탭 전환 핸들러
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex)
  }

  // 3) 다이얼로그(다음주소검색) 콜백
  const handleComplete = (data) => {
    setZipcode(data.zonecode)
    setAddress1(data.address)
    setShowModal(false)
  }

  // 4) 직접 입력 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!alias || !receiverName || !zipcode || !address1 || !phoneNumber) {
      setAlertMsg('필수 항목을 모두 입력해주세요.')
      return
    }
    // 전화번호 형식 검증
    const isValidPhoneNumber = /^01[016789]-\d{3,4}-\d{4}$/.test(phoneNumber)
    if (!isValidPhoneNumber) {
      setAlertMsg('전화번호 형식이 올바르지 않습니다.')
      return
    }

    const newAddress = {
      alias,
      zipcode,
      address1,
      address2,
      receiverName,
      phoneNumber,
      isDefault: isDefault ? 1 : 0,
    }

    try {
      await addressApis.registerAddress(newAddress)
      setAlertMsg(null)
      // 저장 후 다시 목록 새로고침
      fetchAddresses()
      // 자동으로 “기본 배송지” 탭으로 돌아가게 할 수도 있습니다:
      setActiveTab(0)
      // 인풋 초기화
      setAlias('')
      setReceiverName('')
      setZipcode('')
      setAddress1('')
      setAddress2('')
      setPhoneNumber('')
      setIsDefault(false)
    } catch (err) {
      setAlertMsg('주소 등록 중 오류가 발생했습니다.')
      console.error(err)
    }
  }

  // 5) 전화번호 자동 하이픈 처리
  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.length <= 3) return onlyNums
    if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`
  }

  // 6) “기본 배송지” 탭에서 주소 선택 시 부모 컴포넌트에게 전달
  const handleSelectAddress = (addrId) => {
    setSelectedAddressId(addrId)
    if (onAddressSelected) {
      const selected = addressList.find((a) => a.addressId === addrId)
      onAddressSelected(selected)
    }
  }

  // 7) 기본 배송지 탭에서 “더보기 토글” 버튼
  const toggleShowAll = () => {
    setShowAll((prev) => !prev)
  }

  // 화면에 표시할 주소 리스트: showAll=true면 전체, 아니면 최대 3개
  const displayedAddresses = showAll ? addressList : addressList.slice(0, 3)

  return (
    <CAccordionBody>
      {/* 탭 네비게이션 */}
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === 0}
            onClick={() => handleTabChange(0)}
            style={{ cursor: 'pointer' }}
          >
            배송지 목록
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 1}
            onClick={() => handleTabChange(1)}
            style={{ cursor: 'pointer' }}
          >
            배송지 추가
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        {/* ─────────────────────────────────────────────────────
             1) 기본 배송지 탭
             ───────────────────────────────────────────────────── */}
        <CTabPane visible={activeTab === 0}>
          <div style={{ padding: '1rem' }}>
            {fetchError && <CAlert color="danger">{fetchError}</CAlert>}

            {/* 주소 카드 목록 */}
            {addressList.length === 0 ? (
              <div className="text-center text-muted">등록된 배송지가 없습니다.</div>
            ) : (
              <>
                <CRow className="g-3">
                  {displayedAddresses.map((item) => (
                    <CCol key={item.addressId} xs={12} sm={12}>
                      <CCard
                        className="h-100"
                        style={{
                          border:
                            selectedAddressId === item.addressId
                              ? '2px solid #0d6efd'
                              : '1px solid #ddd',
                        }}
                      >
                        <CCardHeader>
                          <CFormCheck
                            type="radio"
                            name="selectAddress"
                            label={item.alias}
                            checked={selectedAddressId === item.addressId}
                            onChange={() => handleSelectAddress(item.addressId)}
                          />
                        </CCardHeader>
                        <CCardBody style={{ padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            {item.receiverName} | {item.phoneNumber}
                          </div>
                          <div style={{ fontSize: '0.85rem' }}>
                            ({item.zipcode}) {item.address1} {item.address2}
                          </div>
                          {item.isDefault === 1 && (
                            <span
                              className="badge bg-primary"
                              style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}
                            >
                              기본 배송지
                            </span>
                          )}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>

                {/* 더보기 / 접기 버튼 */}
                {addressList.length > 3 && (
                  <div className="text-center mt-3">
                    <CButton color="link" onClick={toggleShowAll}>
                      {showAll ? '접기 ▲' : '더보기 ▼'}
                    </CButton>
                  </div>
                )}
              </>
            )}

            {/* ─────────────────────────────────────────────────────
                 2) 배송메모, 다음에도 사용할게요
                 ───────────────────────────────────────────────────── */}
            <div className="mt-4">
              <CFormLabel>배송 메모</CFormLabel>
              <CFormInput
                type="text"
                placeholder="배송 시 요청사항을 입력해주세요."
                value={deliveryMemo}
                onChange={(e) => setDeliveryMemo(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <CFormCheck
                type="checkbox"
                label="다음에도 사용할게요"
                checked={useNextTime}
                onChange={(e) => setUseNextTime(e.target.checked)}
              />
            </div>
          </div>
        </CTabPane>

        {/* ─────────────────────────────────────────────────────
             3) 직접 입력 탭
             ───────────────────────────────────────────────────── */}
        <CTabPane visible={activeTab === 1}>
          <div style={{ padding: '1rem' }}>
            {alertMsg && <CAlert color="danger">{alertMsg}</CAlert>}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel>주소지 별칭</CFormLabel>
                  <CFormInput
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="예: 우리집, 회사"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel>수령인</CFormLabel>
                  <CFormInput
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="홍길동"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={8}>
                  <CFormLabel>우편번호</CFormLabel>
                  <CFormInput value={zipcode} readOnly placeholder="우편번호" />
                </CCol>
                <CCol xs={4} className="d-flex align-items-end">
                  <CButton color="secondary" onClick={() => setShowModal(true)}>
                    주소 검색
                  </CButton>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel>기본 주소</CFormLabel>
                  <CFormInput value={address1} readOnly placeholder="검색 후 자동 입력" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel>상세 주소</CFormLabel>
                  <CFormInput
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="예: 101동 202호"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel>전화번호</CFormLabel>
                  <CFormInput
                    value={phoneNumber}
                    placeholder="010-1234-5678"
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormCheck
                    label="기본 배송지로 설정"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                  />
                </CCol>
              </CRow>

              <div className="text-end">
                <CButton color="secondary" className="me-2" onClick={() => setActiveTab(0)}>
                  취소
                </CButton>
                <CButton color="primary" type="submit">
                  저장
                </CButton>
              </div>
            </CForm>
          </div>

          {/* DaumPostcode 모달 */}
          <CModal visible={showModal} onClose={() => setShowModal(false)}>
            <CModalBody>
              <DaumPostcode onComplete={handleComplete} />
            </CModalBody>
          </CModal>
        </CTabPane>
      </CTabContent>
    </CAccordionBody>
  )
}

export default AddressSection
