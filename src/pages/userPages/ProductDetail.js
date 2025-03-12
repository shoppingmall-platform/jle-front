import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CImage,
  CBadge,
} from '@coreui/react'
import { getProductById } from '@/services/productService'
import { formatPrice } from '@/utils/utils'

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('') // 선택된 이미지
  const [selectedColor, setSelectedColor] = useState('') // 선택된 색상
  const [selectedSize, setSelectedSize] = useState('') // 선택된 사이즈

  useEffect(() => {
    const fetchedProduct = getProductById(productId)
    if (fetchedProduct) {
      setProduct(fetchedProduct)
      setSelectedImage(fetchedProduct.images[0]) // 첫 번째 이미지 기본 선택
      setSelectedColor(fetchedProduct.colors?.[0]?.code || '') // 첫 번째 색상 기본 선택
    }
  }, [productId])

  if (!product) {
    return (
      <CContainer className="text-center mt-5">
        <h2>상품을 찾을 수 없습니다.</h2>
      </CContainer>
    )
  }

  return (
    <CContainer className="mt-5 mb-5">
      <CRow className="justify-content-center">
        <CCol xs={12} md={10} lg={8}>
          <CCard className="border-0 shadow-lg p-4">
            <CRow className="g-4">
              {/* 📌 왼쪽 - 상품 이미지 갤러리 */}
              <CCol xs={12} md={6} className="text-center">
                <CImage
                  fluid
                  src={selectedImage}
                  className="main-product-image"
                  style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
                />
                <div className="d-flex justify-content-center mt-3">
                  {product.images.map((img, index) => (
                    <CImage
                      key={index}
                      src={img}
                      className={`thumbnail-image ${selectedImage === img ? 'selected' : ''}`}
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

              {/* 📌 오른쪽 - 상품 정보 */}
              <CCol xs={12} md={6} className="d-flex flex-column justify-content-between">
                <div>
                  {product.isNew && (
                    <CBadge color="dark" className="me-2">
                      NEW
                    </CBadge>
                  )}
                  <CCardTitle className="h4 fw-bold">{product.name}</CCardTitle>
                  <CCardText className="text-muted">상품 코드: {product.sku}</CCardText>

                  {/* 📌 가격 표시 */}
                  <div className="mt-3">
                    {product.discountRate > 0 ? (
                      <div>
                        <span className="fw-bold text-danger fs-4">
                          {formatPrice(product.discountPrice)}
                        </span>
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="fw-bold fs-4">{formatPrice(product.price)}</span>
                    )}
                  </div>

                  {/* 📌 색상 선택 */}
                  <div className="mt-3">
                    <h6>색상</h6>
                    <div className="d-flex">
                      {product.colors.map((color) => (
                        <div
                          key={color.code}
                          className={`color-swatch ${selectedColor === color.code ? 'selected' : ''}`}
                          onClick={() => setSelectedColor(color.code)}
                          style={{
                            backgroundColor: color.hex,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            margin: '0 5px',
                            cursor: 'pointer',
                            border:
                              selectedColor === color.code ? '2px solid black' : '1px solid #ddd',
                          }}
                          title={color.name}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* 📌 사이즈 선택 */}
                  <div className="mt-3">
                    <h6>사이즈</h6>
                    <div className="d-flex">
                      {product.sizes.map((size) => (
                        <CButton
                          key={size}
                          color={selectedSize === size ? 'dark' : 'light'}
                          className="me-2"
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </CButton>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 📌 장바구니 & 구매 버튼 */}
                <div className="mt-4">
                  <CButton color="dark" className="w-100 mb-2">
                    장바구니에 추가
                  </CButton>
                  <CButton color="danger" className="w-100">
                    지금 구매하기
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CCard>

          {/* 📌 상세 설명 섹션 */}
          <CCard className="mt-4 p-4">
            <h5>상품 설명</h5>
            <p>{product.description}</p>
          </CCard>

          {/* 📌 배송 & 반품 안내 */}
          <CCard className="mt-4 p-4">
            <h5>배송 안내</h5>
            <p>평균 배송 기간: 2~5일</p>
            <h5 className="mt-3">교환 및 반품 안내</h5>
            <p>상품 수령 후 7일 이내 교환/반품 가능</p>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductDetail
