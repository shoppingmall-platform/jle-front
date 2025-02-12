import React from 'react'
import { CButton } from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  showButtons = true,
  includeTime = false,
}) => {
  const handleButtonClick = (days) => {
    const today = new Date()
    setStartDate(new Date(today.setDate(today.getDate() - days)))
    setEndDate(new Date())
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {showButtons && (
        <>
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

          <CButton className="custom-button" onClick={() => handleButtonClick(3)}>
            3일
          </CButton>

          <CButton className="custom-button" onClick={() => handleButtonClick(7)}>
            7일
          </CButton>

          <CButton
            className="custom-button"
            onClick={() => handleButtonClick(30)} // 1개월 = 30일
          >
            1개월
          </CButton>

          <CButton
            className="custom-button"
            onClick={() => handleButtonClick(90)} // 3개월 = 90일
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
        </>
      )}

      <DatePicker
        showIcon
        dateFormat={includeTime ? 'yyyy.MM.dd HH:mm' : 'yyyy.MM.dd'}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="시작 날짜"
        className="custom-datepicker"
        showTimeSelect={includeTime}
        timeFormat="HH:mm"
        timeIntervals={30}
      />

      <span>~</span>

      <DatePicker
        showIcon
        dateFormat={includeTime ? 'yyyy.MM.dd HH:mm' : 'yyyy.MM.dd'}
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="종료 날짜"
        className="custom-datepicker"
        showTimeSelect={includeTime}
        timeFormat="HH:mm"
        timeIntervals={30}
      />
    </div>
  )
}

export default DateRangePicker
