import React from 'react'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AdminSidebarNav } from '@/layout/adminLayouts/AdminSidebarNav'

import { logo } from '@/assets/brand/logo'
import { sygnet } from '@/assets/brand/sygnet'

// sidebar nav config
import navigation from '@/_nav'
import useSidebarStore from '@/store/common/sidebarStore'

const AdminSidebar = () => {
  const { sidebarShow, unfoldable, setSidebarShow, toggleUnfoldable } = useSidebarStore()

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        setSidebarShow(visible)
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={() => setSidebarShow(false)} />
      </CSidebarHeader>
      <AdminSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={toggleUnfoldable} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AdminSidebar)
