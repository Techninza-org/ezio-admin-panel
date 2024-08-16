import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'


// sidebar nav config
import navigation from '../_nav'
import CIcon from '@coreui/icons-react'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* className="border-bottom" */}
      <CSidebarHeader >
        <CSidebarBrand to="/">
          {/* <h2>EZI Vendor</h2> */}
          {/* <CIcon customClassName="sidebar-brand-full" height={32} /> */}
          {/* <div className='d-flex justify-content-center align-items-center'> */}
            <CImage src={'https://ezio.s3.eu-north-1.amazonaws.com/logo.jpg'} height={100} width={180} fluid />
          {/* </div> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
