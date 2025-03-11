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
import { getHomeProducts } from '@/services/productService'
import { formatPrice } from '@/utils/utils'

const Home = () => {
  // 실제 구현 시에는 서버에서 데이터를 가져오거나 useEffect로 데이터를 가져옵니다
  const bestProducts = getHomeProducts('best', 4)
  const newProducts = getHomeProducts('new', 4)
  const saleProducts = getHomeProducts('sale', 4)

  return (
    <>
      {/* Hero Banner */}
      {/* <CCarousel controls indicators dark className="mb-5">
        <CCarouselItem>
          <img
            className="d-block w-100"
            src="/images/hero-banner.jpg"
            alt="New Collection"
            style={{ height: "500px", objectFit: "cover" }}
          />
          <CCarouselCaption className="d-none d-md-block">
            <h2>NEW COLLECTION</h2>
            <p>2025 봄/여름 컬렉션을 만나보세요</p>
            <CButton component={Link} to="/category/new" color="light" className="mt-2">
              SHOP NOW
            </CButton>
          </CCarouselCaption>
        </CCarouselItem>
        <CCarouselItem>
          <img
            className="d-block w-100"
            src="/placeholder.svg?height=500&width=1200"
            alt="Season Off"
            style={{ height: "500px", objectFit: "cover" }}
          />
          <CCarouselCaption className="d-none d-md-block">
            <h2>SEASON OFF</h2>
            <p>최대 70% 할인된 가격으로 만나보세요</p>
            <CButton component={Link} to="/category/sale" color="light" className="mt-2">
              SHOP NOW
            </CButton>
          </CCarouselCaption>
        </CCarouselItem>
      </CCarousel> */}

      {/* Best Products */}
      <CContainer className="mb-5 mt-5">
        <h3 className="text-center mb-4">WEEKLY BEST</h3>
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
          {bestProducts.map((product) => (
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
      </CContainer>

      {/* New Arrivals */}
      <CContainer className="mb-5">
        <h3 className="text-center mb-4">NEW ARRIVALS</h3>
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
          {newProducts.map((product) => (
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
      </CContainer>

      {/* Banner */}
      {/* <div className="bg-dark text-white py-5 mb-5">
        <CContainer>
          <CRow className="align-items-center">
            <CCol md={6} className="text-center text-md-start">
              <h2 className="display-5 fw-bold mb-3">SUMMER COLLECTION</h2>
              <p className="lead mb-4">가볍고 시원한 여름 컬렉션으로 스타일리시한 여름을 준비하세요.</p>
              <CButton component={Link} to="/category/summer" color="light" size="lg">
                자세히 보기
              </CButton>
            </CCol>
            <CCol md={6} className="d-none d-md-block">
              <img src="/placeholder.svg?height=400&width=600" alt="Summer Collection" className="img-fluid rounded" />
            </CCol>
          </CRow>
        </CContainer>
      </div> */}

      {/* Sale Products */}
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
      </CContainer>
    </>
  )
}

export default Home
