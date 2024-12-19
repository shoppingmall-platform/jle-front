import React from 'react'
import AdminContent from './AdminContent'
import AdminFooter from './AdminFooter'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => {
  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AdminHeader />
        <div className="body flex-grow-1">
          <AdminContent />
        </div>
        <AdminFooter />
      </div>
    </div>
  )
}

export default AdminLayout
