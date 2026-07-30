import { all, call, put, takeLatest } from 'redux-saga/effects'
import axios from 'Util/noAuth'
import { LOGIN, LOGOUT } from 'ActionTypes'
import MENU_TREE from 'Components/layout/fakeMenuData.json'
import { loginSuccess, loginFailure } from './action'
import { writeDevSession } from './devSession'

const FAKE_LOGIN_DATA = {
  messageid: '0',
  content: {
    accessToken: 'fake-token-for-local-development',
    customer: { customerCode: 'MRD1001', customerName: '恆宇貿易股份有限公司' },
    operatorName: '陳佩君',
    functions: MENU_TREE,
  },
}

const loginAPI = async (formValue) =>
  IS_DEV_ENV
    ? FAKE_LOGIN_DATA
    : axios.post('/frontendapi/doLogin', formValue).then((response) => response.data)

function* loginSaga({ payload }) {
  try {
    const formValue = {
      customercode: payload.customerCode,
      operatorid: window.btoa(payload.operatorId),
      password: payload.password,
    }
    const response = yield call(loginAPI, formValue)
    if (response.messageid !== '0') throw response

    sessionStorage.setItem('mrd_access_token', response.content.accessToken)
    writeDevSession(response.content)
    yield put(loginSuccess(response.content))
  } catch (error) {
    yield put(loginFailure(error))
  }
}

function* logoutSaga() {
  sessionStorage.clear()
}

export default function* rootSaga() {
  yield all([takeLatest(LOGIN, loginSaga), takeLatest(LOGOUT, logoutSaga)])
}
