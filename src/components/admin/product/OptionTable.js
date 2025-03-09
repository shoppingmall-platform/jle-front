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
  CButton,
  CAlert,
  CImage,
  CCloseButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { MultiSelect } from 'react-multi-select-component'
import { getOptionList } from '@/apis/product/optionApis'

const OptionTable = ({ onOptionsChange }) => {
  const [useOption, setUseOption] = useState(false) // 옵션 사용 여부
  const [optionSetting, setOptionSetting] = useState('optionset') // 옵션세트: optionset, 옵션: options

  const [options, setOptions] = useState([]) // MultiSelect에 사용할 옵션 데이터
  const [optionSets, setOptionSets] = useState([]) // 옵션세트 데이터
  const [selectedOptionSet, setSelectedOptionSet] = useState(null) // 선택된 옵션세트
  // 선택된 옵션: { [옵션명]: [선택된 옵션값들] }
  const [selectedOptions, setSelectedOptions] = useState({})

  // 조합 정보를 저장할 상태
  // 각 조합은 { combination: [옵션값 배열], 재고, 추가가격 } 형태로 저장
  const [optionCombinations, setOptionCombinations] = useState([])

  const [showModal, setShowModal] = useState(false)

  const fetchInitialOptions = async () => {
    try {
      const params = { page: 0, size: 10 }
      const options = await getOptionList(params)

      if (!options || options.length === 0) {
        console.warn('옵션 데이터가 없습니다.')
        setOptions([])
        return
      }

      // 데이터를 MultiSelect 형식에 맞게 변환 (label, value 형태)
      const transformedOptions = options.map((opt) => ({
        label: opt.optionTypeName, // MultiSelect에서 보이는 옵션 이름
        value: opt.optionTypeId.toString(), // ID를 문자열로 변환
        values: opt.optionValues.map((v) => v.optionValueName), // 옵션 값 배열
      }))

      console.log('변환된 옵션 데이터:', transformedOptions)
      setOptions(transformedOptions) // 상태 저장
    } catch (error) {
      console.error('옵션 데이터를 가져오는 중 오류 발생:', error)
      setOptions([]) // 오류 발생 시 안전하게 빈 배열로 설정
    }

    // 기존 옵션 세트 로직 유지
    try {
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
    } catch (error) {
      console.error('옵션 세트 데이터를 설정하는 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    fetchInitialOptions()
  }, [])

  // 옵션 사용 라디오 버튼 핸들러
  const handleUseOptionChange = (e) => {
    setUseOption(e.target.value === 'T')
  }

  // 옵션 설정 라디오 버튼 핸들러
  const handleOptionSettingChange = (e) => {
    setOptionSetting(e.target.value)
    setSelectedOptionSet(null)
    setSelectedOptions({})
    setOptionCombinations([])
  }

  // 옵션세트 선택 핸들러
  const handleOptionSetChange = (e) => {
    const selectedSet = optionSets.find((set) => set.id === Number(e.target.value))
    setSelectedOptionSet(selectedSet || null)
    setSelectedOptions(
      selectedSet
        ? selectedSet.options.reduce((acc, option) => {
            acc[option.name] = [...option.values]
            return acc
          }, {})
        : {},
    )
    setOptionCombinations([])
  }

  // 전체 선택: 해당 옵션의 모든 값을 선택하거나 해제
  const handleSelectAll = (optionName, values, isChecked) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: isChecked ? [...values] : [],
    }))
    setOptionCombinations([]) // 조합 초기화
  }

  // 개별 옵션값 선택 핸들러
  const handleSelectItem = (optionName, value) => {
    setSelectedOptions((prev) => {
      const updatedValues = prev[optionName] || []
      const newValues = updatedValues.includes(value)
        ? updatedValues.filter((v) => v !== value)
        : [...updatedValues, value]
      return { ...prev, [optionName]: newValues }
    })
    setOptionCombinations([])
  }

  // MultiSelect 옵션 변경 핸들러 (옵션 불러오기 모드)
  // const handleMultiSelectChange = (selected) => {
  //   const newSelectedOptions = selected.reduce((acc, option) => {
  //     acc[option.label] = [...option.values] // 값 입력은 나중에 사용자가 체크박스로 하게 됨
  //     return acc
  //   }, {})
  //   setSelectedOptions(newSelectedOptions)
  //   setOptionCombinations([])
  // }

  const handleMultiSelectChange = (selected) => {
    console.log('선택된 옵션:', selected)

    // 선택된 옵션을 `{ label: values }` 형태의 객체로 저장
    const newSelectedOptions = selected.reduce((acc, option) => {
      acc[option.label] = [...option.values] // 옵션값 리스트 저장
      return acc
    }, {})

    setSelectedOptions(newSelectedOptions)
    setOptionCombinations([]) // 기존 옵션 조합 초기화
  }

  // 선택된 옵션 조합을 생성하는 함수
  const generateCombinations = (selectedOptions) => {
    const optionNames = Object.keys(selectedOptions)
    if (optionNames.length === 0) return []
    const optionValues = optionNames.map((name) => selectedOptions[name])
    // 만약 하나라도 선택된 옵션값이 없다면 빈 배열 반환
    if (optionValues.some((arr) => arr.length === 0)) return []

    // 모든 조합 생성 (reduce를 사용하여 누적)
    const combinations = optionValues.reduce((acc, values, index) => {
      if (index === 0) return values.map((value) => [value])
      return acc.flatMap((prevCombination) => values.map((value) => [...prevCombination, value]))
    }, [])
    return combinations
  }

  // 조합 생성 버튼 클릭 시 호출
  const handleGenerateCombinations = () => {
    const combos = generateCombinations(selectedOptions)
    // 각 조합에 대해 초기 재고 0, 추가금액 0 으로 초기화한 객체 생성
    const newCombinations = combos.map((combo) => ({
      combination: combo,
      재고: 0,
      추가가격: 0,
    }))
    setOptionCombinations(newCombinations)
  }

  // 각 조합의 재고와 추가금액 변경 핸들러
  const handleCombinationChange = (index, field, value) => {
    setOptionCombinations((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: Number(value) }
      return updated
    })
  }

  // 최종적으로 상품 옵션 JSON 구조를 만드는 함수
  const getFinalOptionsJSON = () => {
    // 옵션 구성 정보를 위해 옵션 종류 리스트 (예: ['색상', '사이즈'])를 가져옴
    const optionKinds =
      optionSetting === 'optionset'
        ? selectedOptionSet?.options.map((opt) => opt.name)
        : options.filter((opt) => selectedOptions.hasOwnProperty(opt.label)).map((opt) => opt.label)
    // 각 조합에 대해 상품옵션이름은 조합의 각 값들을 '/'로 이어붙인 값으로 설정
    const 상품옵션 = optionCombinations.map((comboObj) => {
      const { combination, 재고, 추가가격 } = comboObj
      const 상품옵션이름 = combination.join('/')
      // 옵션구성 배열 생성
      const 옵션구성 = optionKinds.map((kind, idx) => ({
        옵션종류: kind,
        옵션값: combination[idx],
      }))
      return { 상품옵션이름, 옵션구성, 재고, 추가가격 }
    })
    return { 상품옵션 }
  }
  useEffect(() => {
    if (onOptionsChange) {
      onOptionsChange(getFinalOptionsJSON())
    }
  }, [optionCombinations, selectedOptions, selectedOptionSet, optionSetting])

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
                  value="T"
                  label="사용함"
                  checked={useOption === true}
                  onChange={handleUseOptionChange}
                />
                <CFormCheck
                  type="radio"
                  name="optionUsage"
                  value="F"
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
                          // 옵션세트 모드이면 selectedOptionSet에서, 옵션불러오기 모드이면 options 배열에서 가져옴
                          const optionData =
                            optionSetting === 'optionset'
                              ? selectedOptionSet?.options.find((opt) => opt.name === optionName)
                              : options.find((opt) => opt.label === optionName)
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

              <tr>
                <td colSpan="5" className="text-center">
                  <CButton color="primary" variant="outline" onClick={handleGenerateCombinations}>
                    옵션 조합 생성
                  </CButton>
                </td>
              </tr>

              {optionCombinations.length > 0 && (
                <tr>
                  <td colSpan="5">
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>상품옵션이름</CTableHeaderCell>
                          <CTableHeaderCell>옵션구성</CTableHeaderCell>
                          <CTableHeaderCell>재고</CTableHeaderCell>
                          <CTableHeaderCell>추가가격</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {optionCombinations.map((combo, idx) => {
                          // 옵션 종류 리스트 (예: 색상, 사이즈)
                          const optionKinds =
                            optionSetting === 'optionset'
                              ? selectedOptionSet?.options.map((opt) => opt.name)
                              : options
                                  .filter((opt) => selectedOptions.hasOwnProperty(opt.label))
                                  .map((opt) => opt.label)
                          // 옵션 구성: 각 옵션종류와 해당 조합 값 매핑
                          const 옵션구성 = optionKinds.map((kind, index) => (
                            <span key={kind}>
                              {kind}: {combo.combination[index]}{' '}
                            </span>
                          ))
                          return (
                            <CTableRow key={idx}>
                              <CTableDataCell>{combo.combination.join('/')}</CTableDataCell>
                              <CTableDataCell>{옵션구성}</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  type="number"
                                  value={combo.재고}
                                  onChange={(e) =>
                                    handleCombinationChange(idx, '재고', e.target.value)
                                  }
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  type="number"
                                  value={combo.추가가격}
                                  onChange={(e) =>
                                    handleCombinationChange(idx, '추가가격', e.target.value)
                                  }
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                    <CButton
                      color="primary"
                      onClick={() => {
                        const finalJSON = getFinalOptionsJSON()
                        console.log('최종 옵션 JSON:', finalJSON)
                        setShowModal(true)
                      }}
                    >
                      저장
                    </CButton>
                    <CModal
                      visible={showModal}
                      onClose={() => setShowModal(false)}
                      alignment="center"
                    >
                      <CModalHeader onClose={() => setShowModal(false)}>
                        <CModalTitle>알림</CModalTitle>
                      </CModalHeader>
                      <CModalBody>저장되었습니다.</CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowModal(false)}>
                          닫기
                        </CButton>
                      </CModalFooter>
                    </CModal>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default OptionTable
