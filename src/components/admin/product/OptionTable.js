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

// 옵션, 옵션세트 리스트만 셀렉트 박스에 띄움
// 직접 입력하기는 X

const OptionTable = () => {
  const [useOption, setUseOption] = useState(false) //옵션사용함, 사용안함
  const [optionSetting, setOptionSetting] = useState('optionset') //옵션세트 - optionset, 옵션 - options, 직접 입력하기 - N

  const [options, setOptions] = useState([]) // 옵션 데이터
  const [optionSets, setOptionSets] = useState([]) // 옵션세트 데이터
  const [selectedOptionSet, setSelectedOptionSet] = useState(null) // 선택된 옵션세트
  const [selectedOptions, setSelectedOptions] = useState([]) // 선택된 옵션

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

      const transformedOptions = initialData.map((option) => ({
        label: option.name, // "색상", "사이즈"
        value: option.id.toString(), // "1", "2"
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

      // 선택된 옵션 초기화 (안 하면 undefined 오류 발생)
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

  const handleOptionSetChange = (e) => {
    const selectedSet = optionSets.find((set) => set.id === Number(e.target.value))
    setSelectedOptionSet(selectedSet || null)
    setSelectedOptions(
      selectedSet
        ? selectedSet.options.reduce((acc, option) => {
            acc[option.name] = []
            return acc
          }, {})
        : {},
    )
  }

  const handleSelectAll = (optionName, values, isChecked) => {
    setSelectedOptionValues((prev) => ({
      ...prev,
      [optionName]: isChecked ? [...values] : [],
    }))
  }

  const handleSelectItem = (optionName, value) => {
    setSelectedOptionValues((prev) => {
      const updatedValues = prev[optionName] || []
      return {
        ...prev,
        [optionName]: updatedValues.includes(value)
          ? updatedValues.filter((v) => v !== value)
          : [...updatedValues, value],
      }
    })
  }

  // 옵션 선택 핸들러
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value)
  }

  const generateCombinations = (selectedOptions) => {
    const optionValues = Object.values(selectedOptions)
    if (optionValues.some((arr) => arr.length === 0)) return [] // 하나라도 선택 안 하면 빈 배열 반환

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
                  checked={useOption === true} // 상태와 비교하여 체크
                  onChange={handleUseOptionChange}
                />
                <CFormCheck
                  type="radio"
                  name="optionUsage"
                  value="F" // "F"는 사용안함
                  label="사용안함"
                  checked={useOption === false} // 상태와 비교하여 체크
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
                      value={Object.keys(selectedOptions)}
                      onChange={(selected) => {
                        setSelectedOptions(
                          selected.reduce((acc, option) => {
                            acc[option.label] = []
                            return acc
                          }, {}),
                        )
                      }}
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
                      {/* selectedOptionSet이 null 또는 undefined가 아닌지 확인 후 처리 */}
                      {selectedOptionSet?.options?.map((option) => (
                        <CTableRow key={option.id}>
                          <CTableDataCell>{option.name}</CTableDataCell>
                          <CTableDataCell>
                            <CFormCheck
                              onChange={(e) =>
                                handleSelectAll(option.name, option.values, e.target.checked)
                              }
                              checked={
                                selectedOptions[option.name]?.length === option.values.length
                              }
                            />
                            전체
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {option.values.map((value) => (
                                <div key={value} style={{ display: 'flex', alignItems: 'center' }}>
                                  <CFormCheck
                                    checked={selectedOptions[option.name]?.includes(value) || false}
                                    onChange={() => handleSelectItem(option.name, value)}
                                  />
                                  {value}
                                </div>
                              ))}
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )) || (
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
