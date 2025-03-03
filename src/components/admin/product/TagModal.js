import { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
} from '@coreui/react'

const TagModal = ({ tags, setTags, onClose }) => {
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <CModal visible={true} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>태그 관리</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {tags.map((tag, index) => (
          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
            <span>{tag}</span>
            <CButton color="danger" size="sm" onClick={() => removeTag(tag)}>
              삭제
            </CButton>
          </div>
        ))}
        <CFormInput
          type="text"
          placeholder="새 태그 입력"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="mt-3"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          닫기
        </CButton>
        <CButton color="primary" onClick={addTag}>
          추가
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default TagModal
