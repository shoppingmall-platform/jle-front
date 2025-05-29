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
import { useQuery } from '@tanstack/react-query'
import { getCategoryProductList } from '@/apis/product/productApis'
import { formatPrice } from '@/utils/utils'

const Tag = () => {
  const { tagId } = useParams()
  const {
    data: tagProducts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tagProducts', tagId],
    queryFn: () => getCategoryProductList(0, { tagName: tagId }, { page: 0, size: 8 }),
    enabled: true,
  })

  return (
    <CContainer className="mb-5 mt-5">
      <h3 className="text-center mb-4">{tagId.toUpperCase()} CATEGORY</h3>

      {isLoading ? (
        <p className="text-center">로딩 중...</p>
      ) : isError ? (
        <p className="text-center text-danger">상품 정보를 불러오지 못했습니다.</p>
      ) : (
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
          {tagProducts.length > 0 ? (
            tagProducts.map((product) => (
              <CCol key={product.productId}>
                <CCard className="h-100 border-0 shadow-sm">
                  <Link to={`/product/${product.productId}`}>
                    <div className="position-relative">
                      <CCardImage
                        orientation="top"
                        src={product.thumbnailPath || '/placeholder.svg?height=300&width=300'}
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      {product.discountRate > 0 && (
                        <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 small">
                          {product.discountRate}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                  <CCardBody>
                    <CCardTitle className="h6">{product.productName}</CCardTitle>
                    <CCardText className="small text-muted">
                      {product.tag.map((tag) => tag.productTagName).join(', ')}
                    </CCardText>
                    <div className="d-flex align-items-center">
                      {product.discountRate > 0 ? (
                        <>
                          <span className="fw-bold">
                            {formatPrice(product.price * (1 - product.discountRate / 100))}
                          </span>
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
      )}
    </CContainer>
  )
}

export default Tag
