import { all } from 'redux-saga/effects'
import lookup from './lookup/saga'

export default function* commonSagas() {
  yield all([lookup()])
}
