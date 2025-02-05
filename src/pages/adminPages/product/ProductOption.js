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
import useCheckboxSelection from '@/hooks/useCheckboxSelection'

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
      setOptions(initialData)

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
  const handleAddOption = () => {
    if (optionName && optionValues) {
      const valuesArray = optionValues.split(',').map((value) => value.trim())
      const newOption = {
        id: options.length + 1,
        name: optionName,
        values: valuesArray,
        description: optionDescription,
      }
      setOptions([...options, newOption])
      setOptionName('')
      setOptionValues('')
      setOptionDescription('')
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
                        <CTableHeaderCell>옵션설명</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {options.map((option) => (
                        <CTableRow key={option.id}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={optionsCheckbox.selectedItems.includes(option.id)}
                              onChange={() => optionsCheckbox.handleSelectItem(option.id)}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{option.id}</CTableDataCell>
                          <CTableDataCell>{option.name}</CTableDataCell>
                          <CTableDataCell>{option.values.join(', ')}</CTableDataCell>
                          <CTableDataCell>{option.description}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <CButton
                    color="danger"
                    onClick={() => optionsCheckbox.handleDeleteSelected(setOptions)}
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
                  <CFormLabel>옵션명</CFormLabel>
                  <CFormInput value={optionName} onChange={(e) => setOptionName(e.target.value)} />
                  <CFormLabel>옵션값 (쉼표로 구분)</CFormLabel>
                  <CFormInput
                    value={optionValues}
                    onChange={(e) => setOptionValues(e.target.value)}
                  />
                  <CFormLabel>옵션설명</CFormLabel>
                  <CFormInput
                    value={optionDescription}
                    onChange={(e) => setOptionDescription(e.target.value)}
                  />
                  <CButton style={{ marginTop: '10px' }} color="primary" onClick={handleAddOption}>
                    옵션 추가
                  </CButton>
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
                              <CTableDataCell>{option.id}</CTableDataCell>
                              <CTableDataCell>{option.name}</CTableDataCell>
                              <CTableDataCell>{option.values.join(', ')}</CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                      <CButton
                        color="secondary"
                        onClick={handleAddOptionSet}
                        disabled={optionSetValues.length < 2 || !optionSetName}
                        style={{ margin: 8 }}
                      >
                        옵션 세트 등록
                      </CButton>
                    </CCol>
                    <CCol xs={12} md={6}>
                      <CFormLabel style={{ margin: 8 }}>사용여부</CFormLabel>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginBottom: 8,
                          gap: '16px',
                        }}
                      >
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

                      <CFormLabel style={{ margin: 8 }}>옵션세트명</CFormLabel>
                      <CFormInput
                        value={optionSetName}
                        onChange={(e) => setOptionSetName(e.target.value)}
                        style={{ marginBottom: 8 }}
                      />

                      <CFormLabel style={{ margin: 8 }}>옵션세트설명</CFormLabel>
                      <CFormInput
                        value={optionSetDescription}
                        onChange={(e) => setOptionSetDescription(e.target.value)}
                        style={{ marginBottom: 8 }}
                      />
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
