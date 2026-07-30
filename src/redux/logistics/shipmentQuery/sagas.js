import { all } from 'redux-saga/effects'
import shipmentInquiry from './shipmentInquiry/saga'
import batchShipmentImport from './batchShipmentImport/saga'

export default function* shipmentQuerySagas() {
  yield all([shipmentInquiry(), batchShipmentImport()])
}
