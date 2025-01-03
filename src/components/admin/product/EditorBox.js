import React, { useState, useMemo, useRef } from 'react'
import { CButton, CFormTextarea } from '@coreui/react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ImageActions } from '@xeger/quill-image-actions'
import { ImageFormats } from '@xeger/quill-image-formats'

// Quill 플러그인 등록
Quill.register('modules/imageActions', ImageActions)
Quill.register('modules/imageFormats', ImageFormats)

const EditorBox = () => {
  const [value, setValue] = useState('')
  const quillRef = useRef()

  const handleSubmit = () => {
    console.log('상세설명 저장:', value)
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'font',
    'float',
    'align',
    'height',
    'width',
  ]

  const modules = useMemo(() => {
    return {
      imageActions: {},
      imageFormats: {},
      toolbar: {
        container: [
          [{ font: [] }],
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          [{ align: [] }, { color: [] }, { background: [] }],
          ['clean'],
        ],
      },
    }
  }, [])

  return (
    <div>
      <ReactQuill
        value={value}
        theme="snow"
        ref={quillRef}
        onChange={setValue}
        formats={formats}
        modules={modules}
        style={{ height: 400, overflowY: 'auto' }}
      />
      <CButton onClick={handleSubmit} color="primary" className="mt-2">
        저장
      </CButton>
    </div>
  )
}

export default EditorBox
