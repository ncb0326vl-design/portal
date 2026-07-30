import {
  GET_CUSTOMERS,
  GET_CUSTOMERS_SUCCESS,
  GET_CUSTOMERS_FAILURE,
  GET_SHIPPING_ACCOUNTS,
  GET_SHIPPING_ACCOUNTS_SUCCESS,
  GET_SHIPPING_ACCOUNTS_FAILURE,
  RESET_LOOKUP,
} from 'ActionTypes'

const initialState = {
  customers: [],
  customersLoading: false,
  customersError: null,
  shippingAccounts: [],
  shippingAccountsLoading: false,
  shippingAccountsError: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS:
      return { ...state, customersLoading: true, customersError: null }
    case GET_CUSTOMERS_SUCCESS:
      return { ...state, customersLoading: false, customers: action.payload }
    case GET_CUSTOMERS_FAILURE:
      return { ...state, customersLoading: false, customersError: action.error }

    case GET_SHIPPING_ACCOUNTS:
      return { ...state, shippingAccountsLoading: true, shippingAccountsError: null }
    case GET_SHIPPING_ACCOUNTS_SUCCESS:
      return { ...state, shippingAccountsLoading: false, shippingAccounts: action.payload }
    case GET_SHIPPING_ACCOUNTS_FAILURE:
      return { ...state, shippingAccountsLoading: false, shippingAccountsError: action.error }

    case RESET_LOOKUP:
      return initialState
    default:
      return state
  }
}
