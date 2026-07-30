import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { logout } from 'Redux/actions'
import { customerInfo, operatorName } from 'Redux/selectors'
import { confirmModal } from 'Components/swal'

const Header = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const customer = useSelector(customerInfo)
  const operator = useSelector(operatorName)

  const handleLogout = async () => {
    const result = await confirmModal('確定要登出嗎？', { confirmButtonText: '登出' })
    if (result.value) {
      dispatch(logout())
      history.push('/')
    }
  }

  return (
    <nav className="navbar navbar-expand navbar-dark mrd-header px-4">
      <span className="navbar-brand mb-0">Meridian Freight 企業託運平台</span>
      <div className="ml-auto d-flex align-items-center">
        <span className="text-white-50 small mr-3">
          {customer.customerCode} {customer.customerName}／{operator}
        </span>
        <button type="button" className="btn btn-sm btn-outline-light" onClick={handleLogout}>
          登出
        </button>
      </div>
    </nav>
  )
}

export default Header
