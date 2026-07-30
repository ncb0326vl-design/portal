import { all, call, put, takeLatest } from 'redux-saga/effects'
import axios from 'Util/Auth'
import { renameObjectKeysOfArray } from 'Util/Utils'
import { GET_CUSTOMERS, GET_SHIPPING_ACCOUNTS } from 'ActionTypes'
import {
  getCustomersSuccess,
  getCustomersFailure,
  getShippingAccountsSuccess,
  getShippingAccountsFailure,
} from './action'

const FAKE_CUSTOMERS = {
  messageid: '0',
  content: {
    data: [
      { custcode: 'MRD1001', custname: '恆宇貿易股份有限公司' },
      { custcode: 'MRD1002', custname: '欣茂食品股份有限公司' },
      { custcode: 'MRD1003', custname: '立群電子零件有限公司' },
    ],
  },
}

const FAKE_SHIPPING_ACCOUNTS = {
  messageid: '0',
  content: {
    data: [
      { acctno: 'SA-88120001', acctname: '台北總公司', custcode: 'MRD1001' },
      { acctno: 'SA-88120002', acctname: '桃園倉儲中心', custcode: 'MRD1001' },
      { acctno: 'SA-88120003', acctname: '台中營業所', custcode: 'MRD1001' },
      { acctno: 'SA-88130001', acctname: '高雄廠', custcode: 'MRD1002' },
      { acctno: 'SA-88130002', acctname: '台南物流中心', custcode: 'MRD1002' },
      { acctno: 'SA-88140001', acctname: '新竹科學園區廠', custcode: 'MRD1003' },
    ],
  },
}

const getCustomersAPI = async () =>
  IS_DEV_ENV
    ? FAKE_CUSTOMERS
    : axios.post('/common/getCustomers', {}).then((response) => response.data)

const getShippingAccountsAPI = async (formValue) =>
  IS_DEV_ENV
    ? {
        ...FAKE_SHIPPING_ACCOUNTS,
        content: {
          data: FAKE_SHIPPING_ACCOUNTS.content.data.filter(
            (item) => item.custcode === formValue.custcode
          ),
        },
      }
    : axios.post('/common/getShippingAccounts', formValue).then((response) => response.data)

function* getCustomersSaga() {
  try {
    const response = yield call(getCustomersAPI)
    if (response.messageid !== '0') throw response

    const data = renameObjectKeysOfArray(response.content.data, {
      custcode: 'customerCode',
      custname: 'customerName',
    })
    yield put(getCustomersSuccess(data))
  } catch (error) {
    yield put(getCustomersFailure(error))
  }
}

function* getShippingAccountsSaga({ payload }) {
  try {
    const response = yield call(getShippingAccountsAPI, { custcode: payload.customerCode })
    if (response.messageid !== '0') throw response

    const data = renameObjectKeysOfArray(response.content.data, {
      acctno: 'accountNo',
      acctname: 'accountName',
      custcode: 'customerCode',
    })
    yield put(getShippingAccountsSuccess(data))
  } catch (error) {
    yield put(getShippingAccountsFailure(error))
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(GET_CUSTOMERS, getCustomersSaga),
    takeLatest(GET_SHIPPING_ACCOUNTS, getShippingAccountsSaga),
  ])
}
