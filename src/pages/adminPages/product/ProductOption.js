import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormCheck,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { getOptionList, registerOption, deleteOption } from '@/apis/product/optionApis'

const ProductOption = () => {
  const [options, setOptions] = useState([])
  const [optionName, setOptionName] = useState('')
  const [optionValues, setOptionValues] = useState('')

  // 초기 데이터를 서버에서 가져오는 함수
  const fetchInitialOptions = async () => {
    try {
      const params = {
        page: 0,
        size: 10,
      }
      const options = await getOptionList(params)
      setOptions(options)
    } catch (err) {
      console.error('옵션 데이터를 가져오는 중 오류 발생:', err)
    }
  }

  useEffect(() => {
    fetchInitialOptions()
  }, [])

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
    }
  }

  // 옵션 삭제 함수
  const handleDeleteOption = async () => {
    if (optionsCheckbox.selectedItems.length === 0) {
      alert('삭제할 옵션을 선택하세요.')
      return
    }

    try {
      // 옵션 삭제 API 호출 (각 ID에 대해 요청)
      await Promise.all(
        optionsCheckbox.selectedItems.map(async (selectedOption) => {
          console.log(selectedOption)
          const body = {
            optionTypeId: selectedOption,
          }
          console.log('body', body)
          await deleteOption(body)
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

  const optionsCheckbox = useCheckboxSelection(options, 'optionTypeId')

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>옵션 관리</h3>
      </CRow>

      {/* 옵션 목록 */}
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

      {/* 옵션 등록 */}
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
    </div>
  )
}

export default ProductOption
