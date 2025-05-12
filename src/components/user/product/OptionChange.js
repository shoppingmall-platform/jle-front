import React from 'react'
import { CButton } from '@coreui/react'

const OptionChange = ({ top, left, optionTypes, selectedOptions, handleSelectOption, onClose }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      zIndex: 1000,
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minWidth: '200px',
    }}
  >
    {/* X 버튼 대체 */}
    <div style={{ textAlign: 'right' }}>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>
    </div>

    {Object.entries(optionTypes).map(([type, values]) => (
      <div key={type} className="mt-2">
        <h6>{type}</h6>
        <div className="d-flex flex-wrap">
          {values.map((value) => (
            <CButton
              key={value}
              size="sm"
              color={selectedOptions[type] === value ? 'dark' : 'light'}
              className="me-2 mb-2"
              onClick={() => handleSelectOption(type, value)}
            >
              {value}
            </CButton>
          ))}
        </div>
      </div>
    ))}

    <div className="d-flex justify-content-end mt-3">
      <CButton size="sm" color="dark" className="me-2">
        추가
      </CButton>
      <CButton size="sm" color="primary">
        변경
      </CButton>
    </div>
  </div>
)

export default OptionChange
