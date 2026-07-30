import { lazy } from 'react'
import { forceMessageModal } from 'Components/swal'

const MAX_RETRY = 10

/**
 * React.lazy with retry — chunk requests fail intermittently behind the corporate proxy.
 */
const lazyLoad = (importer) =>
  lazy(() => {
    const attempt = (retriesLeft) =>
      importer().catch((error) => {
        if (retriesLeft <= 0) {
          forceMessageModal('頁面載入失敗，請重新登入後再試。')
          sessionStorage.clear()
          throw error
        }
        return new Promise((resolve) => setTimeout(resolve, 300)).then(() => attempt(retriesLeft - 1))
      })
    return attempt(MAX_RETRY)
  })

export default lazyLoad
