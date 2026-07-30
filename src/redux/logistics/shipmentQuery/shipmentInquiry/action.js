import {
  GET_SHIPMENT_LIST,
  GET_SHIPMENT_LIST_SUCCESS,
  GET_SHIPMENT_LIST_FAILURE,
  RESET_SHIPMENT_LIST,
  GET_INVOICE_SUMMARY,
  GET_INVOICE_SUMMARY_SUCCESS,
  GET_INVOICE_SUMMARY_FAILURE,
  RESET_INVOICE_SUMMARY,
  GET_SHIPMENT_EXCEPTION,
  GET_SHIPMENT_EXCEPTION_SUCCESS,
  GET_SHIPMENT_EXCEPTION_FAILURE,
  RESET_SHIPMENT_EXCEPTION,
  RESET_SHIPMENT_INQUIRY,
} from 'ActionTypes'

export const getShipmentList = (payload) => ({ type: GET_SHIPMENT_LIST, payload })
export const getShipmentListSuccess = (payload) => ({ type: GET_SHIPMENT_LIST_SUCCESS, payload })
export const getShipmentListFailure = (error) => ({ type: GET_SHIPMENT_LIST_FAILURE, error })
export const resetShipmentList = () => ({ type: RESET_SHIPMENT_LIST })

export const getInvoiceSummary = (payload) => ({ type: GET_INVOICE_SUMMARY, payload })
export const getInvoiceSummarySuccess = (payload) => ({
  type: GET_INVOICE_SUMMARY_SUCCESS,
  payload,
})
export const getInvoiceSummaryFailure = (error) => ({ type: GET_INVOICE_SUMMARY_FAILURE, error })
export const resetInvoiceSummary = () => ({ type: RESET_INVOICE_SUMMARY })

export const getShipmentException = (payload) => ({ type: GET_SHIPMENT_EXCEPTION, payload })
export const getShipmentExceptionSuccess = (payload) => ({
  type: GET_SHIPMENT_EXCEPTION_SUCCESS,
  payload,
})
export const getShipmentExceptionFailure = (error) => ({
  type: GET_SHIPMENT_EXCEPTION_FAILURE,
  error,
})
export const resetShipmentException = () => ({ type: RESET_SHIPMENT_EXCEPTION })

export const resetShipmentInquiry = () => ({ type: RESET_SHIPMENT_INQUIRY })
