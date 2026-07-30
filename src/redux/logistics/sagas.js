import { all } from 'redux-saga/effects'
import shipmentQuery from './shipmentQuery/sagas'

export default function* logisticsSagas() {
  yield all([shipmentQuery()])
}
