import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from 'ActionTypes'

export const login = (payload) => ({ type: LOGIN, payload })
export const loginSuccess = (payload) => ({ type: LOGIN_SUCCESS, payload })
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, error })
export const logout = () => ({ type: LOGOUT })
