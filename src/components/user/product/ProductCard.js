import React from 'react'
import { CCard, CCardImage, CCardBody, CCardText, CBadge } from '@coreui/react'

const ProductCard = () => {
  return (
    <CCard style={{ width: '100%', maxWidth: '300px' }}>
      <CCardImage
        orientation="top"
        src="https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif"
        alt="Product"
        style={{ maxHeight: '200px', objectFit: 'contain' }}
      />
      <CCardBody>
        <CCardText style={{ fontSize: '10px', margin: '6px 0', fontWeight: 'bold' }}>
          레브 벨로아 골지 헨리넥 반팔 4 color
        </CCardText>
        <CCardText style={{ fontSize: '10px', margin: '3px 0' }}>27,000원</CCardText>
        <CBadge color="danger" style={{ fontSize: '8px' }}>
          New
        </CBadge>
      </CCardBody>
    </CCard>
  )
}

export default ProductCard
