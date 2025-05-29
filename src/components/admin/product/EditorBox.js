import React, { useState, useMemo, useRef, useEffect } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize'
import AWS from 'aws-sdk'
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CAlert,
  CImage,
  CCloseButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'

if (!Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize)
}

AWS.config.update({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
  }),
})

const s3 = new AWS.S3()

const EditorBox = ({ onContentChange, value: initialValue = '', resetTrigger }) => {
  const [value, setValue] = useState(initialValue)
  const [showModal, setShowModal] = useState(false)
  const quillRef = useRef()

  const handleSubmit = async () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML
    const images = editorContent.match(/(<img[^>]*src\s*=\s*["']?([^>"']+)["']?[^>]*>)/g) || []
    const updatedContent = await handleImageUpload(images, editorContent)

    console.log('서버로 보낼 HTML:', updatedContent) // ✅ 저장 시 최종 데이터 확인

    if (onContentChange) {
      onContentChange(updatedContent) // ✅ 부모 컴포넌트로 HTML 전달
    }

    setShowModal(true)
  }

  const onChangeValue = (e) => {
    console.log(e)
    setValue(e)
  }
  useEffect(() => {
    setValue(initialValue) // 상태 초기화
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      quill.setContents(quill.clipboard.convert(initialValue))
    }
  }, [initialValue])

  // const handleImageUpload = async (images, editorContent) => {
  //   for (let image of images) {
  //     const base64Src = image.match(/src="([^"]+)"/)[1]
  //     const blob = base64ToBlob(base64Src)
  //     const imageUrl = await uploadImage(blob)
  //     editorContent = editorContent.replace(base64Src, imageUrl)
  //   }
  //   return editorContent
  // }
  const resizeImage = async (base64, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous' // 외부 이미지 처리용
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const width = img.width * scale
        const height = img.height * scale

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Canvas toBlob failed'))
            }
          },
          'image/jpeg',
          0.85, // 압축 품질
        )
      }
      img.onerror = reject
      img.src = base64
    })
  }

  const handleImageUpload = async (images, editorContent) => {
    for (let image of images) {
      const base64Src = image.match(/src="([^"]+)"/)[1]
      const blob = await resizeImage(base64Src, 800) // 너비 제한 리사이징
      const imageUrl = await uploadImage(blob)

      // <img> 태그에 style 속성 강제 삽입
      let updatedImgTag = image.replace(base64Src, imageUrl)

      // style이 이미 있는 경우: 기존 스타일에 추가만 (안 겹치게)
      if (/style=/.test(updatedImgTag)) {
        updatedImgTag = updatedImgTag.replace(
          /style="([^"]*)"/,
          (_, style) => `style="${style}; max-width:100%; height:auto;"`,
        )
      } else {
        // style이 없는 경우: 새로 추가
        updatedImgTag = updatedImgTag.replace('<img', '<img style="max-width:100%; height:auto;"')
      }

      editorContent = editorContent.replace(image, updatedImgTag)
    }
    return editorContent
  }

  const base64ToBlob = (base64) => {
    const byteCharacters = atob(base64.split(',')[1])
    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      byteArrays.push(new Uint8Array(byteNumbers))
    }
    return new Blob(byteArrays, { type: 'image/jpeg' })
  }

  const uploadImage = async (blob) => {
    try {
      const params = {
        Bucket: import.meta.env.VITE_BUCKET_NAME,
        Key: `uploads/${Date.now()}`,
        Body: blob,
        ContentType: blob.type,
      }
      const { Location } = await s3.upload(params).promise()
      return Location
    } catch (err) {
      console.error('S3 Upload Error:', err)
      throw new Error('이미지 업로드 중 오류가 발생했습니다.')
    }
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
    'color',
    'background',
  ]

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          [{ align: [] }, { color: [] }, { background: [] }],
          ['clean'],
        ],
        handlers: {
          image: function imageHandler() {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.setAttribute('multiple', true) // ✅ multiple 추가
            input.click()

            input.onchange = async () => {
              const files = input.files
              if (files) {
                for (const file of files) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    const quill = quillRef.current.getEditor()
                    const range = quill.getSelection(true)
                    quill.insertEmbed(range.index, 'image', reader.result)
                    quill.setSelection(range.index + 1)
                  }
                  reader.readAsDataURL(file)
                }
              }
            }
          },
        },
      },
      imageResize: {
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white',
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }
  }, [])

  return (
    <CContainer style={{ height: '100%' }}>
      <CRow className="my-3">
        <CCol style={{ height: '100%' }}>
          <ReactQuill
            value={value}
            theme="snow"
            ref={quillRef}
            onChange={onChangeValue}
            formats={formats}
            modules={modules}
            style={{ height: '430px' }}
          />
        </CCol>
      </CRow>
      <CRow className="mt-5">
        <CCol>
          <CButton color="primary" onClick={handleSubmit}>
            저장
          </CButton>
          <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
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
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default EditorBox
