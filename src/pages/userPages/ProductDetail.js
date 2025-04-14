import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardTitle,
  CCardText,
  CButton,
  CImage,
  CBadge,
} from '@coreui/react'
import { getProductDetail } from '@/apis/product/productApis'
import { formatPrice } from '@/utils/utils'

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedOptions, setSelectedOptions] = useState({})
  const [optionTypes, setOptionTypes] = useState({})

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductDetail(productId)
        if (data) {
          setProduct(data)
          setSelectedImage(data.thumbnailPath || '')
          extractOptionTypes(data.productOptions || [])
        }
      } catch (error) {
        console.error('상품 정보 불러오기 실패:', error)
      }
    }

    fetchProduct()
  }, [productId])

  const extractOptionTypes = (productOptions) => {
    const grouped = {}

    productOptions.forEach((option) => {
      option.productOptionDetails.forEach(({ productOptionType, productOptionDetailName }) => {
        if (!grouped[productOptionType]) grouped[productOptionType] = new Set()
        grouped[productOptionType].add(productOptionDetailName)
      })
    })

    const converted = Object.entries(grouped).reduce((acc, [type, values]) => {
      acc[type] = Array.from(values)
      return acc
    }, {})

    setOptionTypes(converted)
  }

  const handleSelectOption = (type, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  if (!product) {
    return (
      <CContainer className="text-center mt-5">
        <h2>상품을 찾을 수 없습니다.</h2>
      </CContainer>
    )
  }

  const isNew = product.productState === 'NEW'
  const images = [product.thumbnailPath]
  product.productImagePaths.map((image) => images.push(image.path))
  console.log('images', images)

  return (
    <CContainer className="mt-5 mb-5">
      <CRow className="justify-content-center">
        <CCol xs={12} md={10} lg={8}>
          <CCard className="border-0 shadow-lg p-4">
            <CRow className="g-4">
              {/* 왼쪽 이미지 갤러리 */}
              <CCol xs={12} md={6} className="text-center">
                <CImage
                  fluid
                  src={selectedImage}
                  style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
                />
                <div className="d-flex justify-content-center mt-3">
                  {images.map((img, idx) => (
                    <CImage
                      key={idx}
                      src={img}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        margin: '0 5px',
                        cursor: 'pointer',
                        border: selectedImage === img ? '2px solid black' : '1px solid #ddd',
                      }}
                    />
                  ))}
                </div>
              </CCol>

              {/* 오른쪽 상품 정보 */}
              <CCol xs={12} md={6} className="d-flex flex-column justify-content-between">
                <div>
                  {isNew && (
                    <CBadge color="dark" className="me-2">
                      NEW
                    </CBadge>
                  )}
                  <CCardTitle className="h4 fw-bold">{product.name}</CCardTitle>
                  <CCardText className="text-muted">상품 번호: #{product.id}</CCardText>

                  {/* 가격 */}
                  <div className="mt-3">
                    {product.discountedPrice < product.price ? (
                      <>
                        <span className="fw-bold text-danger fs-4">
                          {formatPrice(product.discountedPrice)}
                        </span>
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="fw-bold fs-4">{formatPrice(product.price)}</span>
                    )}
                  </div>

                  {/* 상품 옵션 */}
                  {Object.entries(optionTypes).map(([type, values]) => (
                    <div className="mt-4" key={type}>
                      <h6>{type}</h6>
                      <div className="d-flex flex-wrap">
                        {values.map((value) => (
                          <CButton
                            key={value}
                            color={selectedOptions[type] === value ? 'dark' : 'light'}
                            className="me-2 mb-2"
                            onClick={() => handleSelectOption(type, value)}
                          >
                            {value}
                          </CButton>
                        ))}
                      </div>
                      {!selectedOptions[type] && (
                        <div className="text-danger mt-1 small">[필수] 옵션을 선택해 주세요</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 버튼 영역 */}
                <div className="mt-4">
                  <CButton color="dark" className="w-100 mb-2">
                    장바구니에 담기
                  </CButton>
                  <CButton color="danger" className="w-100">
                    바로 구매하기
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CCard>

          {/* 상품 설명 */}
          <CCard className="mt-4 p-4">
            <h5>상품 설명</h5>
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              style={{ lineHeight: 1.6 }}
            />
          </CCard>

          {/* 배송/반품 */}
          <CCard className="mt-4 p-4">
            <h5>배송 안내</h5>
            <p>배송비: 3,000원 (70,000원 이상 구매 시 무료)</p>
            <h5 className="mt-3">교환 및 반품 안내</h5>
            <p>상품 수령 후 7일 이내 교환/반품 가능</p>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductDetail
