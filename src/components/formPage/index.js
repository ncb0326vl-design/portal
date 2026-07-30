import React from 'react'
import { Link } from 'react-router-dom'

export const NoDataPage = ({ text = '查無符合條件的資料。' }) => (
  <div className="text-center py-5 text-muted">
    <div style={{ fontSize: '2rem' }}>—</div>
    <div className="mt-2">{text}</div>
  </div>
)

export const ApiErrorMessagePage = ({ error }) => (
  <div className="text-center py-5">
    <div className="text-danger font-weight-bold">查詢失敗</div>
    <div className="mt-2 text-muted">
      {(error && (error.message || error.messagecontent)) || '系統忙碌中，請稍後再試。'}
    </div>
    <Link className="btn btn-sm btn-outline-secondary mt-3" to="/">
      回首頁
    </Link>
  </div>
)

export default { NoDataPage, ApiErrorMessagePage }
