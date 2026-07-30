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

/**
 * Both tabs on this page render through the same `tableData` slot.
 */
const initialState = {
  tableData: [],
  tableDataLoading: false,
  tableDataError: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIPMENT_LIST:
    case GET_INVOICE_SUMMARY:
    case GET_SHIPMENT_EXCEPTION:
      return { ...state, tableDataLoading: true, tableDataError: null }

    case GET_SHIPMENT_LIST_SUCCESS:
    case GET_INVOICE_SUMMARY_SUCCESS:
    case GET_SHIPMENT_EXCEPTION_SUCCESS:
      return { ...state, tableDataLoading: false, tableData: action.payload }

    case GET_SHIPMENT_LIST_FAILURE:
    case GET_INVOICE_SUMMARY_FAILURE:
    case GET_SHIPMENT_EXCEPTION_FAILURE:
      return { ...state, tableDataLoading: false, tableDataError: action.error }

    case RESET_SHIPMENT_LIST:
    case RESET_INVOICE_SUMMARY:
    case RESET_SHIPMENT_EXCEPTION:
    case RESET_SHIPMENT_INQUIRY:
      return initialState

    default:
      return state
  }
}
