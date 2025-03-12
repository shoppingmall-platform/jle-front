'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CNavbar,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CRow,
  CCol,
  CBadge,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCart, cilUser, cilMenu } from '@coreui/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { CATEGORIES } from '@/config/constants'
import logo from '/public/logo.jpeg'

const Header = () => {
  const [visible, setVisible] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { cartItemsCount } = useCart()
  const navigate = useNavigate()

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-white text-black py-1">
        <CContainer>
          <CRow className="align-items-center">
            <CCol xs={6} className="d-none d-md-block">
              <div className="small">
                <span className="me-3">+ ADD BOOKMARK</span>
                <span>+ DESK ICON</span>
              </div>
            </CCol>
            <CCol xs={12} md={6}>
              <div className="d-flex justify-content-center justify-content-md-end small">
                {isAuthenticated ? (
                  <>
                    <span className="me-3">{user?.name}님</span>
                    <Link to="/my-page" className="text-black me-3">
                      MY PAGE
                    </Link>
                    <Link to="/" onClick={logout} className="text-black">
                      LOGOUT
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-black me-3">
                      LOGIN
                    </Link>
                    <Link to="/signup" className="text-black me-3">
                      JOIN
                    </Link>
                  </>
                )}
                <Link to="/cart" className="text-dark me-3">
                  CART ({cartItemsCount})
                </Link>
                <Link to="/mypage" className="text-dark">
                  MY PAGE
                </Link>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Logo section */}
      <div className="bg-white py-4 text-center">
        <CContainer>
          <Link to="/">
            <CImage fluid align="center" src={logo} width={'30%'} />
          </Link>
        </CContainer>
      </div>

      {/* Secondary info bar */}
      <div className="bg-white border-top border-bottom py-2">
        <CContainer>
          <CRow>
            <CCol xs={6}>
              <div className="small">
                <span className="me-3">CALL CENTER +</span>
                <span>BANK INFO +</span>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Main navigation */}
      <CNavbar expand="lg" colorScheme="light" className="bg-white border-bottom">
        <CContainer>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          >
            <CIcon icon={cilMenu} />
          </CNavbarToggler>

          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="me-auto mb-2 mb-lg-0 justify-content-center w-100">
              {CATEGORIES.map((category) => (
                <CNavItem key={category.slug}>
                  <CNavLink component={Link} to={`/category/${category.slug}`} className="px-3">
                    {category.name}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNavbarNav>
          </CCollapse>

          {/* <div className="d-flex">
            <Link to="/cart" className="position-relative me-3">
              <CIcon icon={cilCart} size="lg" />
              {cartItemsCount > 0 && (
                <CBadge
                  color="dark"
                  position="top-end"
                  shape="rounded-pill"
                  className="position-absolute"
                >
                  {cartItemsCount}
                </CBadge>
              )}
            </Link>
            <CDropdown variant="nav-item">
              <CDropdownToggle color="light" caret={false}>
                <CIcon icon={cilUser} size="lg" />
              </CDropdownToggle>
              <CDropdownMenu>
                {isAuthenticated ? (
                  <>
                    <CDropdownItem component={Link} to="/my-page">
                      마이페이지
                    </CDropdownItem>
                    <CDropdownItem component={Link} to="/order">
                      주문조회
                    </CDropdownItem>
                    <CDropdownItem component={Link} to="/wishlist">
                      위시리스트
                    </CDropdownItem>
                    <CDropdownItem divider />
                    <CDropdownItem onClick={logout}>로그아웃</CDropdownItem>
                  </>
                ) : (
                  <>
                    <CDropdownItem component={Link} to="/login">
                      로그인
                    </CDropdownItem>
                    <CDropdownItem component={Link} to="/register">
                      회원가입
                    </CDropdownItem>
                  </>
                )}
              </CDropdownMenu>
            </CDropdown>
          </div> */}
        </CContainer>
      </CNavbar>

      {/* Promotion banner */}
      {/* <div className="bg-light border-bottom py-2">
        <CContainer>
          <div className="text-center">
            <p className="mb-0">시즌오프 ~70%</p>
          </div>
        </CContainer>
      </div> */}
    </>
  )
}

export default Header
