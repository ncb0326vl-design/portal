import {
  GET_CUSTOMERS,
  GET_CUSTOMERS_SUCCESS,
  GET_CUSTOMERS_FAILURE,
  GET_SHIPPING_ACCOUNTS,
  GET_SHIPPING_ACCOUNTS_SUCCESS,
  GET_SHIPPING_ACCOUNTS_FAILURE,
  RESET_LOOKUP,
} from 'ActionTypes'

export const getCustomers = () => ({ type: GET_CUSTOMERS })
export const getCustomersSuccess = (payload) => ({ type: GET_CUSTOMERS_SUCCESS, payload })
export const getCustomersFailure = (error) => ({ type: GET_CUSTOMERS_FAILURE, error })

export const getShippingAccounts = (payload) => ({ type: GET_SHIPPING_ACCOUNTS, payload })
export const getShippingAccountsSuccess = (payload) => ({
  type: GET_SHIPPING_ACCOUNTS_SUCCESS,
  payload,
})
export const getShippingAccountsFailure = (error) => ({
  type: GET_SHIPPING_ACCOUNTS_FAILURE,
  error,
})

export const resetLookup = () => ({ type: RESET_LOOKUP })
