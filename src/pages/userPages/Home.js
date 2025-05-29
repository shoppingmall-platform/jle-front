import { Link } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import { getCategoryProductList } from '@/apis/product/productApis'
import { formatPrice } from '@/utils/utils'

const Home = () => {
  const categoryId = 0
  // 실제 구현 시에는 서버에서 데이터를 가져오거나 useEffect로 데이터를 가져옵니다
  // const bestProducts = getHomeProducts('best', 4)
  // const newProducts = getHomeProducts('new', 4)
  // const saleProducts = getHomeProducts('sale', 4)

  const {
    data: bestProducts = [],
    isBestProductsLoading,
    isBestProductsError,
  } = useQuery({
    queryKey: ['bestProducts'],
    queryFn: () =>
      getCategoryProductList(categoryId, { tagName: '추천상품' }, { page: 0, size: 4 }),
    enabled: categoryId !== undefined && categoryId !== null,
  })

  const {
    data: newProducts = [],
    isNewProductsLoading,
    isNewProductsError,
  } = useQuery({
    queryKey: ['newProducts'],
    queryFn: () => getCategoryProductList(categoryId, { tagName: '신상품' }, { page: 0, size: 4 }),
    enabled: categoryId !== undefined && categoryId !== null,
  })

  // const {
  //   data: saleProducts = [],
  //   isSaleProductsLoading,
  //   isSaleProductsError,
  // } = useQuery({
  //   queryKey: ['saleProducts'],
  //   queryFn: () => getCategoryProductList(categoryId, { tagNmae: '새상품' }, { page: 0, size: 4 }),
  //   enabled: !!categoryId,
  // })

  return (
    <>
      {/* Best Products */}
      {isBestProductsLoading ? (
        <p className="text-center">로딩 중...</p>
      ) : isBestProductsError ? (
        <p className="text-center text-danger">상품 정보를 불러오지 못했습니다.</p>
      ) : (
        <CContainer className="mb-5 mt-5">
          <h3 className="text-center mb-4">WEEKLY BEST</h3>
          <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
            {bestProducts.length > 0 ? (
              bestProducts.map((product) => (
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
        </CContainer>
      )}

      {/* New Arrivals */}
      {
        isNewProductsLoading ? (
          <p className="text-center">로딩 중...</p>
        ) : isNewProductsError ? (
          <p className="text-center text-danger">상품 정보를 불러오지 못했습니다.</p>
        ) : (
          <CContainer className="mb-5">
            <h3 className="text-center mb-4">NEW ARRIVALS</h3>
            <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
              {newProducts.length > 0 ? (
                newProducts.map((product) => (
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
                              <span className="fw-bold">
                                {formatPrice(product.discountedPrice)}
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
          </CContainer>
        )

        /*{ Sale Products}
      <CContainer className="mb-5">
        <h3 className="text-center mb-4">SPECIAL SALE</h3>
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
          {saleProducts.map((product) => (
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
          ))}
        </CRow>
      </CContainer> */
      }
    </>
  )
}

export default Home
