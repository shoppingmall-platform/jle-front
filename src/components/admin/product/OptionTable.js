import { React, useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { MultiSelect } from 'react-multi-select-component'

// 옵션, 옵션세트 리스트만 셀렉트 박스에 띄움
// 직접 입력하기는 X

const OptionTable = () => {
  const [useOption, setUseOption] = useState(false)
  const [optionSetting, setOptionSetting] = useState('T')

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
    setOptionSetting(e.target.value) // "옵션 설정"의 값에 맞게 설정
    console.log(optionSets, '옵셋')
  }

  const handleOptionSetChange = (e) => {
    const selectedSet = optionSets.find((set) => set.id === Number(e.target.value))
    setSelectedOptionSet(selectedSet)
  }

  // 개별 옵션 선택 핸들러
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value)
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
                    <CFormCheck
                      type="radio"
                      name="optionSettings"
                      value="N"
                      label="직접 입력하기"
                      checked={optionSetting === 'N'}
                      onChange={handleOptionSettingChange}
                    />
                  </div>
                </td>
              </tr>
              {/* 옵션 설정에 따른 내용 표시 */}
              {useOption && optionSetting === 'optionset' && (
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
              {useOption && optionSetting === 'options' && (
                <tr>
                  <td>옵션 불러오기</td>
                  <td colSpan="4">
                    <MultiSelect
                      options={options} // 옵션 리스트 적용
                      value={selectedOptions} // 선택된 옵션
                      onChange={setSelectedOptions} // 선택 시 상태 업데이트
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
              {useOption && optionSetting === 'N' && (
                <tr>
                  <td colSpan="4">직접 입력하기</td>
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
