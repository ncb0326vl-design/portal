import { combineReducers } from 'redux'
import shipmentInquiry from './shipmentInquiry/reducer'
import batchShipmentImport from './batchShipmentImport/reducer'

export default combineReducers({ shipmentInquiry, batchShipmentImport })
