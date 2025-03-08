import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTabContent,
  CTabPane,
  CNav,
  CNavItem,
  CNavLink,
  CTab,
} from '@coreui/react'
import '../adminpage.css'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { getOptionList, registerOption, deleteOption } from '@/apis/product/optionApis'

const ProductOption = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const [options, setOptions] = useState([])
  const [optionSets, setOptionSets] = useState([])
  const [optionName, setOptionName] = useState('')
  const [optionValues, setOptionValues] = useState('')
  const [optionDescription, setOptionDescription] = useState('')
  const [optionSetName, setOptionSetName] = useState('')
  const [optionSetValues, setOptionSetValues] = useState([])
  const [optionSetDescription, setOptionSetDescription] = useState('')
  const [optionSetUse, setOptionSetUse] = useState(false)

  // 초기 데이터를 서버에서 가져오는 함수
  const fetchInitialOptions = async () => {
    try {
      const initialData = [
        {
          optionTypeId: 0,
          optionTypeName: 'string',
          optionValues: [
            {
              optionValueId: 0,
              optionValueName: 'string',
            },
          ],
        },
      ]
      try {
        const params = {
          page: 0,
          size: 10,
        }
        const options = await getOptionList(params)
        setOptions(options)
      } catch (err) {
        console.log(err)
      }

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

  const handleTabChange = (newIndex) => {
    setTabIndex(newIndex)
  }

  // 옵션 추가 함수
  const handleAddOption = async () => {
    if (optionName && optionValues) {
      const valuesArray = optionValues.split(',').map((value) => ({
        optionValueName: value.trim(),
      }))

      const newOption = {
        optionTypeName: optionName,
        optionValues: valuesArray,
      }
      console.log('newOption', newOption)
      try {
        // 등록
        await registerOption(newOption)

        // 조회회
        const params = {
          page: 0,
          size: 10,
        }
        const options = await getOptionList(params)
        setOptions(options)
      } catch (err) {
        console.log(err)
      }
      setOptionName('')
      setOptionValues('')
      setOptionDescription('')
    }
  }

  // 옵션 삭제 함수
  const handleDeleteOption = async () => {
    if (optionsCheckbox.selectedItems.length === 0) {
      alert('삭제할 옵션을 선택하세요.')
      return
    }

    try {
      // 선택된 옵션들의 optionTypeId 목록 가져오기
      const selectedOptionIds = options
        .filter((option) => optionsCheckbox.selectedItems.includes(option.optionTypeId))
        .map((option) => option.optionTypeId)

      // 옵션 삭제 API 호출 (각 ID에 대해 요청)
      await Promise.all(
        selectedOptionIds.map(async (id) => {
          await deleteOption(id)
        }),
      )

      // 삭제 후 리스트 갱신
      const params = {
        page: 0,
        size: 10,
      }
      const updatedOptions = await getOptionList(params)
      setOptions(updatedOptions)

      // 선택 항목 초기화
      optionsCheckbox.handleSelectItem([])
    } catch (error) {
      console.error('옵션 삭제 중 오류 발생:', error)
    }
  }

  // 옵션세트 추가
  const handleAddOptionSet = () => {
    if (optionSetName && optionSetValues.length > 1) {
      const newOptionSet = {
        id: optionSets.length + 1,
        name: optionSetName,
        options: optionSetValues,
        description: optionSetDescription,
        use: optionSetUse,
      }
      setOptionSets([...optionSets, newOptionSet])
      setOptionSetName('')
      setOptionSetValues([])
      setOptionSetDescription('')
      setOptionSetUse(false)
    }
    console.log('옵션세트', JSON.stringify(optionSets, null, 2))
  }

  const optionsCheckbox = useCheckboxSelection(options, 'id')
  const optionSetsCheckbox = useCheckboxSelection(optionSets, 'id')

  const handleCheckboxChange = (selectedOption) => {
    setOptionSetValues((prevValues) => {
      const exists = prevValues.some((option) => option.name === selectedOption.name)
      if (exists) {
        // 선택 해제: 동일한 이름의 옵션을 필터링
        return prevValues.filter((option) => option.name !== selectedOption.name)
      } else {
        // 선택 추가: 선택된 옵션 추가
        return [...prevValues, selectedOption]
      }
    })
  }

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>옵션 관리</h3>
      </CRow>
      <CNav variant="tabs" className="mb-4">
        <CNavItem>
          <CNavLink active={tabIndex === 0} onClick={() => handleTabChange(0)}>
            옵션 관리
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={tabIndex === 1} onClick={() => handleTabChange(1)}>
            옵션 세트 관리
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={tabIndex === 0}>
          <CRow>
            <CCol>
              <CCard className="mb-4">
                <CCardHeader>옵션 목록</CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>
                          <CFormCheck
                            checked={optionsCheckbox.selectedItems.length === options.length}
                            onChange={optionsCheckbox.handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell>옵션ID</CTableHeaderCell>
                        <CTableHeaderCell>옵션명</CTableHeaderCell>
                        <CTableHeaderCell>옵션값</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {options.map((option) => (
                        <CTableRow key={option.optionTypeId}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={optionsCheckbox.selectedItems.includes(option.optionTypeId)}
                              onChange={() => optionsCheckbox.handleSelectItem(option.optionTypeId)}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{option.optionTypeId}</CTableDataCell>
                          <CTableDataCell>{option.optionTypeName}</CTableDataCell>
                          <CTableDataCell>
                            {option.optionValues.map((value) => value.optionValueName).join(', ')}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <CButton
                    color="danger"
                    variant="outline"
                    onClick={() => handleDeleteOption()}
                    disabled={optionsCheckbox.selectedItems.length === 0}
                  >
                    선택옵션 삭제
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard className="mb-4">
                <CCardHeader>옵션 등록</CCardHeader>

                <CCardBody>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="text-center table-header">옵션명</td>
                        <td colSpan="4">
                          <CFormInput
                            value={optionName}
                            onChange={(e) => setOptionName(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center table-header">옵션값 (쉼표로 구분)</td>
                        <td colSpan="4">
                          <CFormInput
                            value={optionValues}
                            onChange={(e) => setOptionValues(e.target.value)}
                          />
                        </td>
                      </tr>
                      <CButton
                        style={{ marginTop: '10px' }}
                        color="primary"
                        variant="outline"
                        onClick={handleAddOption}
                      >
                        옵션 추가
                      </CButton>
                    </tbody>
                  </table>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CTabPane>

        <CTabPane visible={tabIndex === 1}>
          <CRow>
            <CCol>
              <CCard className="mb-4">
                <CCardHeader>옵션 세트 목록</CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>
                          <CFormCheck
                            checked={optionSetsCheckbox.selectedItems.length === optionSets.length}
                            onChange={optionSetsCheckbox.handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell>세트ID</CTableHeaderCell>
                        <CTableHeaderCell>세트명</CTableHeaderCell>
                        <CTableHeaderCell>옵션 이름</CTableHeaderCell>
                        <CTableHeaderCell>설명</CTableHeaderCell>
                        <CTableHeaderCell>사용여부</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {optionSets.map((set) => (
                        <CTableRow key={set.id}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={optionSetsCheckbox.selectedItems.includes(set.id)}
                              onChange={() => optionSetsCheckbox.handleSelectItem(set.id)}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{set.id}</CTableDataCell>
                          <CTableDataCell>{set.name}</CTableDataCell>
                          <CTableDataCell>
                            {set.options.map((option) => option.name).join(', ')}
                          </CTableDataCell>
                          <CTableDataCell>{set.description}</CTableDataCell>
                          <CTableDataCell>{set.use ? '사용' : '미사용'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <CButton
                    color="danger"
                    variant="outline"
                    onClick={() => optionSetsCheckbox.handleDeleteSelected(setOptionSets)}
                    disabled={optionSetsCheckbox.selectedItems.length === 0}
                  >
                    선택세트 삭제
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard className="mb-4">
                <CCardHeader>옵션 세트 등록</CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol xs={12} md={6}>
                      <p style={{ margin: 8, fontSize: '16px' }}>옵션을 선택해주세요.(2개 이상)</p>
                      <CTable hover responsive>
                        <CTableBody>
                          {options.map((option) => (
                            <CTableRow key={option.id}>
                              <CTableDataCell>
                                <CFormCheck
                                  type="checkbox"
                                  checked={optionSetValues.some(
                                    (value) => value.name === option.name,
                                  )}
                                  onChange={() => handleCheckboxChange(option)}
                                />
                              </CTableDataCell>
                              <CTableDataCell>{option.optionTypeId}</CTableDataCell>
                              <CTableDataCell>{option.optionTypeName}</CTableDataCell>
                              <CTableDataCell>
                                {option.optionValues
                                  .map((value) => value.optionValueName)
                                  .join(', ')}
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={handleAddOptionSet}
                        disabled={optionSetValues.length < 2 || !optionSetName}
                        style={{ margin: 8 }}
                      >
                        옵션 세트 등록
                      </CButton>
                    </CCol>
                    <CCol xs={12} md={6}>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="text-center table-header">사용여부</td>
                            <td colSpan="4">
                              <div className="radio-group">
                                <CFormCheck
                                  type="radio"
                                  id="useYes"
                                  name="useOptionSet"
                                  checked={optionSetUse === true}
                                  onChange={() => setOptionSetUse(true)}
                                  label="사용함"
                                />
                                <CFormCheck
                                  type="radio"
                                  id="useNo"
                                  name="useOptionSet"
                                  checked={optionSetUse === false}
                                  onChange={() => setOptionSetUse(false)}
                                  label="사용안함"
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center table-header">옵션세트명</td>
                            <td colSpan="4">
                              <CFormInput
                                value={optionSetName}
                                onChange={(e) => setOptionSetName(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center table-header">옵션세트설명</td>
                            <td colSpan="4">
                              <CFormInput
                                value={optionSetDescription}
                                onChange={(e) => setOptionSetDescription(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default ProductOption
