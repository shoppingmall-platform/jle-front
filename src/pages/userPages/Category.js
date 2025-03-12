import { useParams, Link } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
} from '@coreui/react'
import { getCategoryProducts } from '@/services/productService'
import { formatPrice } from '@/utils/utils'

const Category = () => {
  const { categoryId } = useParams()
  const categoryProducts = getCategoryProducts(categoryId, 8) // 8개의 상품 가져오기

  return (
    <CContainer className="mb-5 mt-5">
      <h3 className="text-center mb-4">{categoryId.toUpperCase()} CATEGORY</h3>
      <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
        {categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <CCol key={product.id}>
              <CCard className="h-100 border-0 shadow-sm">
                <Link to={`/product/${product.id}`}>
                  <div className="position-relative">
                    <CCardImage
                      orientation="top"
                      src={product.images[0] || '/placeholder.svg?height=300&width=300'}
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                    {product.isNew && (
                      <span className="position-absolute top-0 start-0 bg-dark text-white px-2 py-1 m-2 small">
                        NEW
                      </span>
                    )}
                    {product.discountRate > 0 && (
                      <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 small">
                        {product.discountRate}% OFF
                      </span>
                    )}
                  </div>
                </Link>
                <CCardBody>
                  <CCardTitle className="h6">{product.name}</CCardTitle>
                  <CCardText className="small text-muted">
                    {product.colorCount > 1 ? `${product.colorCount} colors` : ''}
                  </CCardText>
                  <div className="d-flex align-items-center">
                    {product.discountRate > 0 ? (
                      <>
                        <span className="fw-bold">{formatPrice(product.discountPrice)}</span>
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="fw-bold">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <CCol>
            <p className="text-center">해당 카테고리에 상품이 없습니다.</p>
          </CCol>
        )}
      </CRow>
    </CContainer>
  )
}

export default Category
