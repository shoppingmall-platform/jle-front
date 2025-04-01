import {
  CButton,
  CFormInput,
  CFormCheck,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import React, { useState } from 'react'
import '../adminpage.css'
import EditorBox from '@/components/admin/product/EditorBox'
import UploadFile from '@/components/admin/product/UploadFile'
import OptionTable from '@/components/admin/product/OptionTable'
import TagModal from '@/components/admin/product/TagModal'
import CategoryPicker from '@/components/admin/product/CategoryPicker'
import { registerProduct } from '@/apis/product/productApis'

const ProductAdd = () => {
  const [saleStatus, setSaleStatus] = useState('판매함')
  const [displayStatus, setDisplayStatus] = useState('진열함')
  const [category, setCategory] = useState('') // 카테고리 ID 또는 이름
  const [selectedTags, setSelectedTags] = useState([])
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState(0)
  const [summary, setSummary] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [detailDesc, setDetailDesc] = useState('')
  const [optionData, setOptionData] = useState({})
  const [mainImages, setMainImages] = useState([])
  const [additionalImages, setAdditionalImages] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [tags, setTags] = useState(['신상품', '추천상품'])

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSaleStatusChange = (e) => {
    const value = e.target.value
    setSaleStatus(value === 'T' ? '판매함' : '판매안함')
  }
  const handleDisplayStatusChange = (e) => {
    const value = e.target.value
    setDisplayStatus(value === 'T' ? '진열함' : '진열안함')
  }

  const handleSave = async () => {
    const productData = {
      // saleStatus: saleStatus, // 판매상태
      // displayStatus: displayStatus, // 진열상태
      categoryId: category, // 카테고리
      tags: selectedTags.map((tag) => ({ tagName: tag })), // 태그
      name: productName, // 상품명
      productOptions: optionData?.length ? optionData : [], // 상품옵션
      price: price, // 판매가
      summaryDescription: summary, // 상품요약설명
      simpleDescription: shortDesc, // 상품간략설명
      description: detailDesc, // 상품상세설명
      thumbnail: mainImages.length > 0 ? mainImages[0] : null, // 대표 이미지
      productImages: {
        paths: additionalImages || [], // 추가 이미지 리스트
      },
    }

    console.log('최종 전송 데이터:', JSON.stringify(productData, null, 2))

    try {
      const response = await registerProduct(productData)
      console.log('제품 등록 성공:', response)

      alert('상품이 성공적으로 등록되었습니다.')
    } catch (error) {
      console.error('제품 등록 실패:', error)
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }
  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>상품 등록</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>표시 설정</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">판매상태</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck
                      type="radio"
                      name="saleStatus"
                      value="T"
                      label="판매함"
                      checked={saleStatus === '판매함'}
                      onChange={handleSaleStatusChange}
                    />
                    <CFormCheck
                      type="radio"
                      name="saleStatus"
                      value="F"
                      label="판매안함"
                      checked={saleStatus === '판매안함'}
                      onChange={handleSaleStatusChange}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">진열상태</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck
                      type="radio"
                      name="displayStatus"
                      value="T"
                      label="진열함"
                      checked={displayStatus === '진열함'}
                      onChange={handleDisplayStatusChange}
                    />
                    <CFormCheck
                      type="radio"
                      name="displayStatus"
                      value="F"
                      label="진열안함"
                      checked={displayStatus === '진열안함'}
                      onChange={handleDisplayStatusChange}
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">카테고리 선택</td>
                <td colSpan="4">
                  <CategoryPicker onCategoryChange={(categoryId) => setCategory(categoryId)} />
                </td>
              </tr>
              <tr>
                {/* 리스트로 저장 */}
                <td className="text-center table-header">태그 선택</td>
                <td colSpan="4">
                  <div className="radio-group">
                    {tags.map((tag, index) => (
                      <CFormCheck
                        key={index}
                        label={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                    ))}
                    <CButton
                      color="primary"
                      variant="outline"
                      className="ms-2"
                      onClick={() => setShowModal(true)}
                    >
                      <CIcon icon={cilPlus} size="lg" />
                    </CButton>
                  </div>
                </td>

                {/* CoreUI 모달창 */}
                {showModal && (
                  <TagModal tags={tags} setTags={setTags} onClose={() => setShowModal(false)} />
                )}
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center">상품명</td>
                <td colSpan="2">
                  <CFormInput
                    size="sm"
                    placeholder="상품명을 입력하세요"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </td>
                <td className="text-center">판매가</td>
                <td colSpan="2">
                  <CFormInput
                    size="sm"
                    type="number"
                    placeholder="판매가 입력"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </td>
              </tr>

              <tr>
                <td className="text-center">상품 요약 설명</td>
                <td colSpan="5">
                  <CFormTextarea
                    size="sm"
                    placeholder="상품 요약 설명을 입력하세요"
                    rows="2"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center">상품 간략 설명</td>
                <td colSpan="5">
                  <CFormTextarea
                    size="sm"
                    placeholder="상품 간략 설명을 입력하세요"
                    rows="2"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center">상품 상세 설명</td>
                <td colSpan="5">
                  <EditorBox onContentChange={(content) => setDetailDesc(content)} />
                </td>
              </tr>
              <tr>
                <td className="text-center">할인혜택</td>
                <td colSpan="5"></td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>옵션</CCardHeader>
        <CCardBody>
          <OptionTable onOptionsChange={(data) => setOptionData(data)} />
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>이미지 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center">이미지 등록</td>
                <td colSpan="5">
                  <div>
                    <p>*상품 대표 사진 등록 (1장)</p>
                    <UploadFile maxImages={1} onUpload={(urls) => setMainImages(urls)} />
                    <p className="mt-3">*상품 추가 사진 등록 (최대 10장)</p>
                    <UploadFile maxImages={10} onUpload={(urls) => setAdditionalImages(urls)} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="text-center mb-3">
        <CButton color="primary" onClick={handleSave}>
          저장
        </CButton>
      </div>
    </div>
  )
}

export default ProductAdd
