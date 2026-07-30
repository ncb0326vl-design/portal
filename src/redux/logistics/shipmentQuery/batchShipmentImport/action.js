import {
  PARSE_SHIPMENT_FILE,
  PARSE_SHIPMENT_FILE_SUCCESS,
  PARSE_SHIPMENT_FILE_FAILURE,
  UPDATE_STAGING_ROW,
  REMOVE_STAGING_ROW,
  SUBMIT_BATCH_SHIPMENT,
  SUBMIT_BATCH_SHIPMENT_SUCCESS,
  SUBMIT_BATCH_SHIPMENT_FAILURE,
  RESET_BATCH_SHIPMENT_IMPORT,
} from 'ActionTypes'

export const parseShipmentFile = (payload) => ({ type: PARSE_SHIPMENT_FILE, payload })
export const parseShipmentFileSuccess = (payload) => ({ type: PARSE_SHIPMENT_FILE_SUCCESS, payload })
export const parseShipmentFileFailure = (error) => ({ type: PARSE_SHIPMENT_FILE_FAILURE, error })

export const updateStagingRow = (payload) => ({ type: UPDATE_STAGING_ROW, payload })
export const removeStagingRow = (payload) => ({ type: REMOVE_STAGING_ROW, payload })

export const submitBatchShipment = (payload) => ({ type: SUBMIT_BATCH_SHIPMENT, payload })
export const submitBatchShipmentSuccess = (payload) => ({
  type: SUBMIT_BATCH_SHIPMENT_SUCCESS,
  payload,
})
export const submitBatchShipmentFailure = (error) => ({ type: SUBMIT_BATCH_SHIPMENT_FAILURE, error })

export const resetBatchShipmentImport = () => ({ type: RESET_BATCH_SHIPMENT_IMPORT })
