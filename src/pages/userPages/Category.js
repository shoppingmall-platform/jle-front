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
import { useCategoryStore } from '@/store/product/categoryStore'

const Category = () => {
  const { categoryId } = useParams()
  const selectedCategory = useCategoryStore((state) => state.selectedCategory)
  const {
    data: categoryProducts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categoryProducts', categoryId],
    queryFn: () => getCategoryProductList(categoryId, {}, { page: 0, size: 8 }),
    enabled: !!categoryId,
  })

  return (
    <CContainer className="mb-5 mt-5">
      <h3 className="text-center mb-4">{selectedCategory.toUpperCase()} CATEGORY</h3>

      {isLoading ? (
        <p className="text-center">로딩 중...</p>
      ) : isError ? (
        <p className="text-center text-danger">상품 정보를 불러오지 못했습니다.</p>
      ) : (
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <CCol key={product.productId}>
                <CCard className="h-100 border-0 shadow-sm">
                  <Link to={`/product/${product.productId}`}>
                    <div className="position-relative">
                      <CCardImage
                        orientation="top"
                        src={product.thumbnailPath || '/placeholder.svg?height=300&width=300'}
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      {product.discountedPrice !== product.price &&
                        product.discountInfo?.discountType === '할인금액' && (
                          <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 small">
                            {product.discountInfo.discountValue}원 OFF
                          </span>
                        )}

                      {product.discountedPrice !== product.price &&
                        product.discountInfo?.discountType === '할인율' && (
                          <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 small">
                            {product.discountInfo.discountValue}% OFF
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
                      {product.discountedPrice !== product.price ? (
                        <>
                          <span className="fw-bold">{formatPrice(product.discountedPrice)}</span>
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

export default Category
