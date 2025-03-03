import React, { useState, useRef } from 'react'
import {
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
import AWS from 'aws-sdk'

AWS.config.update({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
  }),
})

const s3 = new AWS.S3()

const UploadFile = ({ maxImages, onUpload }) => {
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const inputRef = useRef(null)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const currentImageCount = images.length

    if (currentImageCount + files.length > maxImages) {
      setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      e.target.value = ''
      return
    } else {
      setError('')
    }

    // 유효한 이미지 파일만 선택하여 File 객체와 미리보기 URL을 저장합니다.
    files
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, maxImages - currentImageCount)
      .forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImages((prevImages) => [...prevImages, { file, preview: reader.result }])
        }
        reader.readAsDataURL(file)
      })

    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const saveEventHandler = async () => {
    try {
      const uploadedUrls = await Promise.all(
        images.map(async (imageObj) => {
          const { file } = imageObj
          const params = {
            Bucket: import.meta.env.VITE_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${file.name}`,
            Body: file,
            ContentType: file.type,
          }

          const { Location } = await s3.upload(params).promise()
          return Location
        }),
      )

      console.log('Uploaded URLs:', uploadedUrls)
      if (onUpload) {
        onUpload(uploadedUrls)
      }
      // 저장 성공 시 Modal 표시
      setShowModal(true)
    } catch (err) {
      console.error('S3 Upload Error:', err)
      setError('이미지 업로드 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      <CButton
        color="primary"
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        style={{ margin: '10px 0' }}
      >
        파일 선택
      </CButton>
      {error && (
        <CAlert color="danger" dismissible>
          {error}
        </CAlert>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {images.map((imageObj, index) => (
          <div
            key={index}
            style={{ position: 'relative', margin: '5px', width: '100px', height: '100px' }}
          >
            <CImage
              src={imageObj.preview}
              alt={`preview-${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <CCloseButton
              style={{ position: 'absolute', top: '5px', right: '5px' }}
              onClick={() => handleRemoveImage(index)}
            />
          </div>
        ))}
      </div>

      <CButton
        color="primary"
        onClick={saveEventHandler}
        style={{ marginLeft: 'auto', display: 'block', marginTop: '10px' }}
      >
        저장
      </CButton>

      {/* 저장 성공 시 Modal 표시 */}
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
    </div>
  )
}

export default UploadFile
