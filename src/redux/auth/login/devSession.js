/**
 * Dev-only mirror of the login response.
 *
 * A full page reload always rebuilds the redux store from scratch, so `loggedIn` goes
 * back to false and `App` bounces you to the login page — even though the access token
 * is still in sessionStorage. Keeping the login payload next to the token lets
 * `configureStore` replay it and stay signed in across reloads.
 *
 * Guarded by RESTORE_DEV_SESSION, which only the `start` scripts set, so none of this
 * reaches a uat/production bundle. Cleared by the logout saga's `sessionStorage.clear()`.
 */
const DEV_SESSION_KEY = 'mrd_dev_session'

export const readDevSession = () => {
  if (!RESTORE_DEV_SESSION) return null
  try {
    return JSON.parse(sessionStorage.getItem(DEV_SESSION_KEY))
  } catch (error) {
    return null
  }
}

export const writeDevSession = (content) => {
  if (!RESTORE_DEV_SESSION) return
  try {
    sessionStorage.setItem(DEV_SESSION_KEY, JSON.stringify(content))
  } catch (error) {
    // Best effort — a failure here just means the next reload asks for a login again.
  }
}
