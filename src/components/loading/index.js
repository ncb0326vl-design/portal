import React from 'react'

const LoadingPrompt = ({ text = '資料查詢中，請稍候…' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading</span>
    </div>
    <div className="mt-3 text-muted">{text}</div>
  </div>
)

export default LoadingPrompt
