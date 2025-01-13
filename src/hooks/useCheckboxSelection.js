import { useState } from 'react'

const useCheckboxSelection = (items, key) => {
  const [selectedItems, setSelectedItems] = useState([])

  // 전체 선택
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(items.map((item) => item[key])) // key를 동적으로 사용
    } else {
      setSelectedItems([])
    }
  }

  // 개별 선택
  const handleSelectItem = (itemKey) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemKey)
        ? prevSelected.filter((key) => key !== itemKey)
        : [...prevSelected, itemKey],
    )
  }

  // 선택된 항목 삭제
  const handleDeleteSelected = (setItems) => {
    setItems((prevItems) => prevItems.filter((item) => !selectedItems.includes(item[key]))) // key를 동적으로 사용
    setSelectedItems([])
  }

  return { selectedItems, handleSelectAll, handleSelectItem, handleDeleteSelected }
}

export default useCheckboxSelection
