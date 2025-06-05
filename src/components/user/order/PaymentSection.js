// src/components/user/order/PaymentSection.jsx
import React from 'react'
import { CRow, CCol, CFormCheck, CFormLabel, CFormSelect, CAlert } from '@coreui/react'

/**
 * @param {string} selectedPaymentMethod
 * @param {function} setSelectedPaymentMethod
 * @param {string} cardCompany
 * @param {function} setCardCompany
 */
const PaymentSection = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cardCompany,
  setCardCompany,
}) => {
  return (
    <div style={{ padding: '1rem' }}>
      <CFormLabel className="fw-semibold mb-2">결제 방법 선택</CFormLabel>

      <CRow className="mb-3">
        <CCol xs={12} md={6}>
          <CFormCheck
            type="radio"
            id="pm_card"
            name="paymentMethod"
            label="신용/체크카드"
            value="card"
            checked={selectedPaymentMethod === 'card'}
            onChange={() => setSelectedPaymentMethod('card')}
          />
        </CCol>
        <CCol xs={12} md={6}>
          <CFormCheck
            type="radio"
            id="pm_bank"
            name="paymentMethod"
            label="계좌 이체"
            value="bank"
            checked={selectedPaymentMethod === 'bank'}
            onChange={() => setSelectedPaymentMethod('bank')}
          />
        </CCol>
      </CRow>

      {selectedPaymentMethod === 'card' && (
        <div className="mb-3">
          <CFormLabel>카드사 선택</CFormLabel>
          <CFormSelect value={cardCompany} onChange={(e) => setCardCompany(e.target.value)}>
            <option value="">카드사 선택</option>
            <option value="visa">VISA</option>
            <option value="master">MasterCard</option>
            <option value="amex">AMEX</option>
          </CFormSelect>
        </div>
      )}

      {selectedPaymentMethod === 'bank' && (
        <div className="text-muted small mb-3">
          * 은행 계좌 이체는 실제 API 연동이 필요합니다. (현재는 샘플 UI)
        </div>
      )}

      {!selectedPaymentMethod && (
        <CAlert color="warning" className="mt-2">
          결제 수단을 선택해주세요.
        </CAlert>
      )}
    </div>
  )
}

export default PaymentSection
