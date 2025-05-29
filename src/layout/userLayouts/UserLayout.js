import React from 'react'
import UserContent from './UserContent'
import UserFooter from './UserFooter'
import UserHeader from './UserHeader'

const UserLayout = () => {
  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <UserHeader />
      <div className="body flex-grow-1 bg-white">
        <UserContent />
      </div>
      <UserFooter />
    </div>
  )
}

export default UserLayout
