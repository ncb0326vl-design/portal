import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { isLoggedIn } from 'Redux/selectors'
import LoginForm from './LoginForm'

const Home = () => {
  const loggedIn = useSelector(isLoggedIn)

  if (loggedIn) return <Redirect to="/logistics/shipment-query/shipment-inquiry" />

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="mrd-card p-4" style={{ width: 380 }}>
        <h1 className="h5 mb-1">Meridian Freight</h1>
        <div className="text-muted small mb-4">企業託運平台</div>
        <LoginForm />
        <div className="text-muted small mt-3">
          本機開發模式已自動帶入測試帳號，直接點擊登入即可。
        </div>
      </div>
    </div>
  )
}

export default Home
