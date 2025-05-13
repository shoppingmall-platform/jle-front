'use client'

import { useEffect, useState } from 'react'
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
import logo from '/public/logo.jpeg'
import { getCategories } from '@/apis/product/categoryApis'
import { getTags } from '@/apis/product/tagApis'
import { useCategoryStore } from '@/store/product/categoryStore'

const Header = () => {
  const [visible, setVisible] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { cartItemsCount } = useCart()

  const selectCategory = useCategoryStore((state) => state.selectCategory)

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([]) // ✅ tags 상태 추가

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      const categoryData = await getCategories()
      const tagData = await getTags()
      if (categoryData) setCategories(categoryData)
      if (tagData) setTags(tagData) // ✅ tag 정보도 가져오기
    }
    fetchCategoriesAndTags()
  }, [])

  const mainCategories = categories.filter((c) => c.categoryLevel === 1)
  const subCategories = categories.filter((c) => c.categoryLevel === 2)

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
            <CImage fluid align="center" src={logo} width={'240px'} />
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
            <div className="d-flex flex-wrap justify-content-center w-100">
              {/* ✅ Tag 버튼 먼저 추가 */}
              {tags.map((tag) => (
                <CDropdown key={`tag-${tag.tagId}`} className="mx-2">
                  <CDropdownToggle
                    color="light"
                    caret={false}
                    className="text-dark fw-bold px-3 py-2"
                  >
                    {/* 수정 필요 */}
                    <Link
                      to={`/tag/${tag.tagName}`}
                      className="text-dark text-decoration-none"
                      onClick={() => selectCategory(tag.tagName)}
                    >
                      {tag.tagName}
                    </Link>
                  </CDropdownToggle>
                </CDropdown>
              ))}

              {/* ✅ 기존 Category 렌더링 */}
              {mainCategories.map((mainCat) => {
                const children = subCategories.filter(
                  (subCat) => subCat.parentCategoryId === mainCat.categoryId,
                )

                return (
                  <CDropdown key={mainCat.categoryId} className="mx-2">
                    <CDropdownToggle
                      color="light"
                      caret={false}
                      className="text-dark fw-bold px-3 py-2"
                    >
                      <Link
                        to={`/category/${mainCat.categoryId}`}
                        className="text-dark text-decoration-none"
                        onClick={() => selectCategory(mainCat.categoryName)}
                      >
                        {mainCat.categoryName}
                      </Link>
                    </CDropdownToggle>

                    {/* ✅ 중분류가 있을 때만 드롭다운 메뉴 표시 */}
                    {children.length > 0 && (
                      <CDropdownMenu>
                        {children.map((subCat) => (
                          <CDropdownItem key={subCat.categoryId}>
                            <Link
                              to={`/category/${subCat.categoryId}`}
                              className="dropdown-item"
                              onClick={() => selectCategory(subCat.categoryName)}
                            >
                              {subCat.categoryName}
                            </Link>
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    )}
                  </CDropdown>
                )
              })}
            </div>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default Header
