import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (USE_CONSOLE) console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <h5>畫面發生錯誤</h5>
          <p className="text-muted">請重新整理頁面，若問題持續請聯繫系統管理員。</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
