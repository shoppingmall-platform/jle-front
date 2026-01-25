"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCart, cilUser, cilMenu } from "@coreui/icons";
import logo from "/public/logo.jpeg";
import { getCategories } from "@/apis/product/categoryApis";
import { getTags } from "@/apis/product/tagApis";
import { useCategoryStore } from "@/store/product/categoryStore";
import { authStore } from "@/store/auth/authStore";

const Header = () => {
  const [visible, setVisible] = useState(false);

  const selectCategory = useCategoryStore((state) => state.selectCategory);

  const isLogin = authStore((state) => state.isLogin());
  const logout = authStore((state) => state.logout);
  const userInfo = authStore((state) => state.userInfo);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]); // ✅ tags 상태 추가

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const categoryData = await getCategories();
        const tagData = await getTags();
        if (categoryData && Array.isArray(categoryData)) {
          setCategories(categoryData);
        }
        if (tagData && Array.isArray(tagData)) {
          setTags(tagData);
        }
      } catch (error) {
        console.error("카테고리/태그 로딩 실패:", error);
        setCategories([]);
        setTags([]);
      }
    };
    fetchCategoriesAndTags();
  }, []);

  const mainCategories = categories.filter((c) => c.categoryLevel === 1);
  const subCategories = categories.filter((c) => c.categoryLevel === 2);

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
                {isLogin ? (
                  <>
                    <span className="me-3">{userInfo?.name}님</span>
                    <Link to="/mypage" className="text-dark me-3">
                      MY PAGE
                    </Link>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm("로그아웃 하시겠습니까?")) {
                          logout();
                        }
                      }}
                      className="text-black me-3"
                    >
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
                  CART
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
            <CImage
              fluid
              align="center"
              src={logo}
              style={{
                maxWidth: "176px", // PC: 원본 크기
                width: "100%", // 모바일: 반응형
              }}
              className="d-none d-md-block mx-auto" // PC용
            />
            <CImage
              fluid
              align="center"
              src={logo}
              style={{
                maxWidth: "140px", // 모바일: 더 작게
                width: "100%",
              }}
              className="d-block d-md-none mx-auto" // 모바일용
            />
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
      <CNavbar
        expand="lg"
        colorScheme="light"
        className="bg-white border-bottom p-0"
      >
        <CContainer>
          <CNavbarToggler
            className="ms-2 my-2 border-0" // 햄버거 버튼 테두리도 제거해서 깔끔하게
            onClick={() => setVisible(!visible)}
          >
            <CIcon icon={cilMenu} />
          </CNavbarToggler>

          <CCollapse className="navbar-collapse" visible={visible}>
            {/* py-4로 위아래 여백을 충분히 주어 시원하게 배치 */}
            <div className="d-flex flex-wrap justify-content-center w-100 py-4 gap-3">
              {/* ✅ Tag: 회색 바탕 제거, 얇은 테두리만 추가 */}
              {Array.isArray(tags) &&
                tags.map((tag) => (
                  <Link
                    key={`tag-${tag.tagId}`}
                    to={`/tag/${tag.tagName}`}
                    onClick={() => selectCategory(tag.tagName)}
                    className="text-decoration-none px-3 py-1 text-dark fw-normal border rounded-pill"
                    style={{
                      fontSize: "0.85rem",
                      letterSpacing: "-0.5px", // 자간을 좁혀서 더 세련되게
                      borderColor: "#eee", // 아주 연한 테두리
                    }}
                  >
                    {tag.tagName}
                  </Link>
                ))}

              {/* ✅ Category: 테두리 없이 텍스트만 깔끔하게 나열 */}
              {mainCategories.map((mainCat) => (
                <Link
                  key={mainCat.categoryId}
                  to={`/category/${mainCat.categoryId}`}
                  onClick={() => selectCategory(mainCat.categoryName)}
                  className="text-decoration-none px-3 py-1 text-dark fw-bold"
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase", // 영문일 경우 대문자로 변환해 깔끔함 강조
                  }}
                >
                  {mainCat.categoryName}
                </Link>
              ))}
            </div>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
};

export default Header;
