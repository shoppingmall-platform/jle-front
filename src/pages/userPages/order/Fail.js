// src/pages/FailPage.jsx
import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CButton, CAlert } from '@coreui/react'

export function FailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const errorCode = searchParams.get('code') || 'UNKNOWN'
  const errorMessage = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.'

  return (
    <div
      className="flex-column align-center w-100"
      style={{
        display: 'flex',
        padding: '2rem 1rem',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <img
        src="https://static.toss.im/lotties/error-spot-apng.png"
        width="120"
        height="120"
        style={{ marginBottom: '1.5rem' }}
        alt="결제 실패"
      />
      <h2 className="title" style={{ marginBottom: '1rem' }}>
        결제에 실패했습니다
      </h2>

      <div
        className="response-section w-100"
        style={{
          width: '100%',
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="response-label">에러 코드</span>
          <span id="error-code" className="response-text">
            {errorCode}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="response-label">메시지</span>
          <span id="error-message" className="response-text">
            {errorMessage}
          </span>
        </div>
      </div>

      <div className="button-group" style={{ width: '100%', display: 'flex', gap: '1rem' }}>
        <CButton color="dark" className="w-100" onClick={() => navigate(-1)}>
          다시 시도
        </CButton>
        <CButton color="secondary" className="w-100" onClick={() => navigate('/')}>
          홈으로
        </CButton>
      </div>
    </div>
  )
}
