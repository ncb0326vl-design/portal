import { all } from 'redux-saga/effects'
import authSagas from './auth/sagas'
import commonSagas from './common/sagas'
import logisticsSagas from './logistics/sagas'

export default function* rootSaga() {
  yield all([authSagas(), commonSagas(), logisticsSagas()])
}
