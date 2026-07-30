import React from 'react'
import Header from './Header'
import PageMenu from './PageMenu'
import PageContent from './PageContent'
import Footer from './Footer'

const Layout = ({ children }) => (
  <div>
    <Header />
    <div className="d-flex">
      <div style={{ width: 230, flex: '0 0 230px' }}>
        <PageMenu />
      </div>
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <PageContent>{children}</PageContent>
        <Footer />
      </div>
    </div>
  </div>
)

export default Layout
