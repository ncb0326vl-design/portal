import { all } from 'redux-saga/effects'
import login from './login/saga'

export default function* authSagas() {
  yield all([login()])
}
