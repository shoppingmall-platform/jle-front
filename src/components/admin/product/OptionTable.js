import { React, useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { MultiSelect } from 'react-multi-select-component'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'

const OptionTable = () => {
  const [useOption, setUseOption] = useState(false) // 옵션 사용 여부
  const [optionSetting, setOptionSetting] = useState('optionset') // 옵션세트: optionset, 옵션: options

  const [options, setOptions] = useState([]) // 옵션 데이터 (MultiSelect용)
  const [optionSets, setOptionSets] = useState([]) // 옵션세트 데이터
  const [selectedOptionSet, setSelectedOptionSet] = useState(null) // 선택된 옵션세트
  // 선택된 옵션은 객체 형태로 { [옵션명]: [선택된 옵션값...] }
  const [selectedOptions, setSelectedOptions] = useState({})

  const fetchInitialOptions = async () => {
    try {
      const initialData = [
        {
          id: 1,
          name: '색상',
          values: ['블랙', '화이트'],
          description: '상품의 색상을 선택합니다.',
        },
        {
          id: 2,
          name: '사이즈',
          values: ['S', 'M', 'L'],
          description: '상품의 사이즈를 선택합니다.',
        },
      ]

      // MultiSelect에 맞게 label, value, values를 함께 포함
      const transformedOptions = initialData.map((option) => ({
        label: option.name, // "색상", "사이즈"
        value: option.id.toString(), // "1", "2"
        values: option.values, // 옵션값 배열 추가
      }))
      setOptions(transformedOptions)

      const initialOptionSets = [
        {
          id: 1,
          name: '세트1',
          options: [
            {
              id: 1,
              name: '색상',
              values: ['블랙', '화이트'],
            },
            {
              id: 2,
              name: '사이즈',
              values: ['S', 'M', 'L'],
            },
          ],
          description: '기본세트입니다.',
          use: true,
        },
      ]
      setOptionSets(initialOptionSets)

      // 선택된 옵션 초기화 (옵션세트 선택 시 사용할 기본값)
      const defaultSelectedOptions = {}
      initialOptionSets[0].options.forEach((option) => {
        defaultSelectedOptions[option.name] = [] // 초기값을 빈 배열로 설정
      })
      setSelectedOptions(defaultSelectedOptions)
    } catch (error) {
      console.error('옵션 데이터를 가져오는 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    fetchInitialOptions()
  }, [])

  // "옵션 사용" 라디오 버튼 변경 핸들러
  const handleUseOptionChange = (e) => {
    setUseOption(e.target.value === 'T') // "T"일 때 true, "F"일 때 false
  }

  // "옵션 설정" 라디오 버튼 변경 핸들러
  const handleOptionSettingChange = (e) => {
    setOptionSetting(e.target.value)
    setSelectedOptionSet(null)
    setSelectedOptions({})
  }

  // 옵션세트 선택 핸들러
  const handleOptionSetChange = (e) => {
    const selectedSet = optionSets.find((set) => set.id === Number(e.target.value))
    setSelectedOptionSet(selectedSet || null)
    setSelectedOptions(
      selectedSet
        ? selectedSet.options.reduce((acc, option) => {
            acc[option.name] = [] // 초기값은 빈 배열
            return acc
          }, {})
        : {},
    )
  }

  // 전체 선택: 해당 옵션의 모든 값을 선택 또는 해제
  const handleSelectAll = (optionName, values, isChecked) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: isChecked ? [...values] : [],
    }))
  }

  // 개별 항목 선택 핸들러
  const handleSelectItem = (optionName, value) => {
    setSelectedOptions((prev) => {
      const updatedValues = prev[optionName] || []
      return {
        ...prev,
        [optionName]: updatedValues.includes(value)
          ? updatedValues.filter((v) => v !== value)
          : [...updatedValues, value],
      }
    })
  }

  // MultiSelect 옵션 변경 핸들러 (옵션 불러오기 모드일 때)
  const handleMultiSelectChange = (selected) => {
    // 선택한 옵션 객체 배열을 바탕으로 selectedOptions 객체 재구성 (값은 빈 배열로 초기화)
    const newSelectedOptions = selected.reduce((acc, option) => {
      acc[option.label] = []
      return acc
    }, {})
    setSelectedOptions(newSelectedOptions)
  }

  // 선택된 옵션들의 모든 조합을 생성 (예: 색상과 사이즈 선택시 모든 조합)
  const generateCombinations = (selectedOptions) => {
    const optionValues = Object.values(selectedOptions)
    if (optionValues.some((arr) => arr.length === 0)) return [] // 하나라도 선택 안 한 경우 빈 배열
    return optionValues.reduce((acc, values) => {
      if (acc.length === 0) return values.map((value) => [value])
      return acc.flatMap((a) => values.map((v) => [...a, v]))
    }, [])
  }

  return (
    <div>
      <table className="table" style={{ tableLayout: 'fixed', width: '100%' }}>
        <tbody>
          <tr>
            <td className="text-center">옵션 사용</td>
            <td colSpan="4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px' }}>
                <CFormCheck
                  type="radio"
                  name="optionUsage"
                  value="T" // "T"는 사용함
                  label="사용함"
                  checked={useOption === true}
                  onChange={handleUseOptionChange}
                />
                <CFormCheck
                  type="radio"
                  name="optionUsage"
                  value="F" // "F"는 사용안함
                  label="사용안함"
                  checked={useOption === false}
                  onChange={handleUseOptionChange}
                />
              </div>
            </td>
          </tr>
          {useOption && (
            <>
              <tr>
                <td className="text-center">옵션 설정</td>
                <td colSpan="4">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px' }}
                  >
                    <CFormCheck
                      type="radio"
                      name="optionSettings"
                      value="optionset"
                      label="옵션세트 불러오기"
                      checked={optionSetting === 'optionset'}
                      onChange={handleOptionSettingChange}
                    />
                    <CFormCheck
                      type="radio"
                      name="optionSettings"
                      value="options"
                      label="옵션 불러오기"
                      checked={optionSetting === 'options'}
                      onChange={handleOptionSettingChange}
                    />
                  </div>
                </td>
              </tr>
              {optionSetting === 'optionset' && (
                <tr>
                  <td className="text-center">옵션세트 불러오기</td>
                  <td colSpan="4">
                    <CFormSelect onChange={handleOptionSetChange}>
                      <option value="">옵션세트 선택</option>
                      {optionSets.map((set) => (
                        <option key={set.id} value={set.id}>
                          {set.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </td>
                </tr>
              )}
              {optionSetting === 'options' && (
                <tr>
                  <td>옵션 불러오기</td>
                  <td colSpan="4">
                    <MultiSelect
                      options={options}
                      value={options.filter((opt) => selectedOptions.hasOwnProperty(opt.label))}
                      onChange={handleMultiSelectChange}
                      labelledBy="옵션 선택"
                      overrideStrings={{
                        selectSomeItems: '옵션 선택',
                        allItemsAreSelected: '모든 옵션 선택됨',
                        search: '검색...',
                      }}
                    />
                  </td>
                </tr>
              )}

              <tr>
                <td className="text-center">사용된 옵션</td>
                <td colSpan="4">
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>옵션명</CTableHeaderCell>
                        <CTableHeaderCell>옵션값</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {Object.keys(selectedOptions).length > 0 ? (
                        Object.keys(selectedOptions).map((optionName) => {
                          // 옵션세트 모드에서는 selectedOptionSet에서 옵션정보를 가져오고,
                          // 옵션 불러오기 모드에서는 options 배열에서 값을 가져옵니다.
                          const optionData =
                            optionSetting === 'optionset'
                              ? selectedOptionSet?.options.find((opt) => opt.name === optionName)
                              : options.find((opt) => opt.label === optionName)
                          // optionData에 values 속성이 있는 경우 사용, 없으면 빈 배열
                          const values = optionData && optionData.values ? optionData.values : []
                          return (
                            <CTableRow key={optionName}>
                              <CTableDataCell>{optionName}</CTableDataCell>
                              <CTableDataCell>
                                {values.length > 0 ? (
                                  <>
                                    <CFormCheck
                                      onChange={(e) =>
                                        handleSelectAll(optionName, values, e.target.checked)
                                      }
                                      checked={
                                        selectedOptions[optionName]?.length === values.length
                                      }
                                    />
                                    전체
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                      {values.map((value) => (
                                        <div
                                          key={value}
                                          style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                          <CFormCheck
                                            checked={
                                              selectedOptions[optionName]?.includes(value) || false
                                            }
                                            onChange={() => handleSelectItem(optionName, value)}
                                          />
                                          {value}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  '옵션값이 없습니다.'
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan="2">옵션이 없습니다.</CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default OptionTable
