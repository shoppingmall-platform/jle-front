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
import { addToCart } from '@/apis/member/cartApis'
import { formatPrice } from '@/utils/utils'
import 'react-quill/dist/quill.snow.css'

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedOptions, setSelectedOptions] = useState({})
  const [optionTypes, setOptionTypes] = useState({})
  const [quantity, setQuantity] = useState(1)

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

  const handleAddToCart = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      alert('옵션을 선택해주세요!')
      return
    }

    // 선택한 옵션에 해당하는 productOptionId 찾기
    const matchedOption = product.productOptions.find((option) => {
      const selectedSet = new Set(
        Object.entries(selectedOptions).map(([type, val]) => `${type}:${val}`),
      )
      const optionSet = new Set(
        option.productOptionDetails.map(
          (d) => `${d.productOptionType}:${d.productOptionDetailName}`,
        ),
      )
      return selectedSet.size === optionSet.size && [...selectedSet].every((v) => optionSet.has(v))
    })

    if (!matchedOption) {
      alert('해당 옵션 조합이 존재하지 않습니다.')
      return
    }

    const payload = [
      {
        productOptionId: matchedOption.productOptionId,
        quantity: quantity,
      },
    ]
    console.log('🛒 장바구니 담기 요청 데이터:', payload)

    try {
      await addToCart(payload)
      alert('장바구니에 담겼습니다!')
    } catch (error) {
      alert('장바구니 추가에 실패했습니다.')
    }
  }

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
    setSelectedOptions((prev) => ({ ...prev, [type]: value }))
  }

  if (!product) {
    return (
      <CContainer className="text-center mt-5">
        <h2>상품을 찾을 수 없습니다.</h2>
      </CContainer>
    )
  }

  const isNew = product.productState === 'NEW'
  const images = [product.thumbnailPath, ...product.productImagePaths.map((img) => img.path)]

  return (
    <CContainer className="mt-5 mb-5">
      <CRow className="justify-content-center">
        <CCol xs={12} md={10} lg={8}>
          <CCard className="border-0 shadow-lg p-4">
            <CRow className="g-4">
              {/* 이미지 */}
              <CCol xs={12} md={6} className="text-center">
                <CImage
                  fluid
                  src={selectedImage}
                  style={{
                    height: '450px',
                    width: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#f8f8f8',
                    border: '1px solid #eee',
                    borderRadius: '6px',
                  }}
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

              {/* 정보 */}
              <CCol xs={12} md={6}>
                <div
                  className="d-flex flex-column justify-content-between"
                  style={{ minHeight: '450px' }}
                >
                  <div>
                    {isNew && (
                      <CBadge color="info" className="me-2">
                        NEW
                      </CBadge>
                    )}
                    <CCardTitle className="h4 fw-bold mt-2">{product.name}</CCardTitle>
                    <CCardText className="text-muted mb-2">
                      상품 번호: #{product.productId}
                    </CCardText>
                    <CCardText className="text-muted small">{product.simpleDescription}</CCardText>
                    <CCardText>{product.summaryDescription}</CCardText>

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

                    {Object.entries(optionTypes).map(([type, values]) => (
                      <div className="mt-4" key={type}>
                        <h6 className="fw-semibold">{type}</h6>
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
                  <div className="mt-3">
                    <h6 className="fw-semibold">수량</h6>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ width: '80px', padding: '4px', textAlign: 'center' }}
                    />
                  </div>

                  <div className="mt-4">
                    <CButton color="dark" className="w-100 mb-2" onClick={handleAddToCart}>
                      장바구니에 담기
                    </CButton>
                    <CButton color="danger" className="w-100">
                      바로 구매하기
                    </CButton>
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCard>

          {/* 설명 */}
          <CCard className="mt-4 p-4">
            <h5 className="fw-bold">상품 설명</h5>
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: product.description }}
              style={{ lineHeight: 1.6 }}
            />
          </CCard>

          {/* 배송 안내 */}
          <CCard className="mt-4 p-4">
            <h5 className="fw-bold">배송 안내</h5>
            <p>배송비: 3,000원 (70,000원 이상 구매 시 무료)</p>
            <h5 className="fw-bold mt-3">교환 및 반품 안내</h5>
            <p>상품 수령 후 7일 이내 교환/반품 가능</p>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductDetail
