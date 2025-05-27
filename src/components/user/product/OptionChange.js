import React from 'react'
import { CButton } from '@coreui/react'
import { updateCartItem } from '@/apis/member/cartApis'

const OptionChange = ({
  top,
  left,
  cartItemId,
  productOptions,
  selectedOptions,
  quantity,
  handleSelectOption,
  onClose,
  onUpdateSuccess,
}) => {
  const buildOptionTypes = (options) => {
    const grouped = {}
    options.forEach((option) => {
      option.productOptionDetails.forEach(({ productOptionType, productOptionDetailName }) => {
        if (!grouped[productOptionType]) grouped[productOptionType] = new Set()
        grouped[productOptionType].add(productOptionDetailName)
      })
    })
    return Object.entries(grouped).reduce((acc, [type, values]) => {
      acc[type] = Array.from(values)
      return acc
    }, {})
  }

  const optionTypes = buildOptionTypes(productOptions)

  const handleUpdate = async () => {
    // 선택된 옵션 조합에 해당하는 productOptionId 찾기
    const selectedSet = new Set(
      Object.entries(selectedOptions).map(([type, val]) => `${type}:${val}`),
    )

    const matchedOption = productOptions.find((option) => {
      const optionSet = new Set(
        option.productOptionDetails.map(
          (d) => `${d.productOptionType}:${d.productOptionDetailName}`,
        ),
      )
      return selectedSet.size === optionSet.size && [...selectedSet].every((v) => optionSet.has(v))
    })

    if (!matchedOption) {
      alert('⚠️ 해당 옵션 조합이 존재하지 않습니다.')
      return
    }

    const payload = [
      {
        cartItemId,
        productOptionId: matchedOption.productOptionId,
        quantity,
      },
    ]
    console.log('🛒 옵션 변경 요청 데이터:', payload)

    try {
      await updateCartItem(payload)
      alert('✅ 장바구니 항목이 변경되었습니다.')
      onUpdateSuccess?.() // 변경 완료 후 콜백 실행
      onClose()
    } catch (error) {
      alert('❌ 변경 실패. 다시 시도해주세요.')
    }
  }

  return (
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
        <CButton size="sm" color="primary" onClick={handleUpdate}>
          변경
        </CButton>
      </div>
    </div>
  )
}

export default OptionChange
