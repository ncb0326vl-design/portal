import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from 'ActionTypes'

const initialState = {
  loggedIn: false,
  loading: false,
  error: null,
  customer: { customerCode: '', customerName: '' },
  operatorName: '',
  functions: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true, error: null }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: true,
        customer: action.payload.customer,
        operatorName: action.payload.operatorName,
        functions: action.payload.functions,
      }
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.error }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
