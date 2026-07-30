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
import { validateStagingRow } from './validation'

const initialState = {
  fileName: '',
  stagingRows: [],
  parsing: false,
  parseError: null,
  submitting: false,
  submitResult: null,
  submitError: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PARSE_SHIPMENT_FILE:
      return { ...state, parsing: true, parseError: null, submitResult: null }
    case PARSE_SHIPMENT_FILE_SUCCESS:
      return {
        ...state,
        parsing: false,
        fileName: action.payload.fileName,
        stagingRows: action.payload.rows,
      }
    case PARSE_SHIPMENT_FILE_FAILURE:
      return { ...state, parsing: false, parseError: action.error, stagingRows: [] }

    case UPDATE_STAGING_ROW: {
      const { index, field, value } = action.payload
      const stagingRows = state.stagingRows.map((row, i) => {
        if (i !== index) return row
        const next = { ...row, [field]: value }
        return { ...next, errors: validateStagingRow(next) }
      })
      return { ...state, stagingRows }
    }

    case REMOVE_STAGING_ROW:
      return {
        ...state,
        stagingRows: state.stagingRows.filter((row, i) => i !== action.payload),
      }

    case SUBMIT_BATCH_SHIPMENT:
      return { ...state, submitting: true, submitError: null }
    case SUBMIT_BATCH_SHIPMENT_SUCCESS:
      return { ...state, submitting: false, submitResult: action.payload }
    case SUBMIT_BATCH_SHIPMENT_FAILURE:
      return { ...state, submitting: false, submitError: action.error }

    case RESET_BATCH_SHIPMENT_IMPORT:
      return initialState
    default:
      return state
  }
}
