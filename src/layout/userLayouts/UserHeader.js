import React from 'react'
import {
  CContainer,
  CNavbar,
  CFormInput,
  CButton,
  CForm,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CHeader,
  CImage,
  CRow,
  CCol,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'
import logo from './../../../public/logo.jpeg'

const menuItems = [
  'Best',
  '[당일발송]',
  '머슬핏',
  'New 5%',
  'All',
  'Outer',
  'Top',
  'Shirts',
  'Bottom',
  'ACC',
  'Shoes',
  '[MADE]',
  '휴양룩',
]

const notice = ['NOTICE', 'Q&A', 'REVIEW', 'EVENT']

const UserHeader = () => {
  return (
    <CHeader>
      <CNavbar className="bg-white" style={{ width: '100%' }}>
        <CContainer fluid>
          <CNavbarNav className="flex-row">
            <CNavItem className="me-3">
              <CNavLink href="#" className="fs-6">
                LOGIN
              </CNavLink>
            </CNavItem>
            <CNavItem className="me-3">
              <CNavLink href="#" className="fs-6">
                JOIN
              </CNavLink>
            </CNavItem>
            <CNavItem className="me-3">
              <CNavLink href="#" className="fs-6">
                CART
              </CNavLink>
            </CNavItem>
            <CNavItem className="me-3">
              <CNavLink href="#" className="fs-6">
                ORDER
              </CNavLink>
            </CNavItem>
            <CNavItem className="me-3">
              <CNavLink href="#" className="fs-6">
                MY PAGE
              </CNavLink>
            </CNavItem>
          </CNavbarNav>
          <CForm className="d-flex ms-auto">
            <CFormInput type="search" className="me-2" placeholder="Search" />
            <CButton type="submit" color="black" variant="outline">
              <CIcon icon={cilMagnifyingGlass} />
            </CButton>
          </CForm>
        </CContainer>
      </CNavbar>
      <CContainer className="my-5">
        <CImage fluid align="center" src={logo} width={'30%'} />
      </CContainer>
      <CContainer fluid style={{ borderTop: '1px solid #000', marginBottom: '3px' }}>
        <CRow style={{ width: '100%', marginTop: '8px' }}>
          <CCol xs={8}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '25px',
                alignItems: 'center',
              }}
            >
              {menuItems.map((item, index) => (
                <CNavLink
                  key={index}
                  href="#"
                  className="text-dark"
                  style={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item}
                </CNavLink>
              ))}
            </div>
          </CCol>
          <CCol
            xs={4}
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '25px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {notice.map((item, index) => (
                <CNavLink
                  key={index}
                  href="#"
                  className="text-dark"
                  style={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item}
                </CNavLink>
              ))}
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </CHeader>
  )
}

export default UserHeader
