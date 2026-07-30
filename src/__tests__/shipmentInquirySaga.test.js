import { expectSaga } from 'redux-saga-test-plan'
import reducer from 'Redux/logistics/shipmentQuery/shipmentInquiry/reducer'
import saga from 'Redux/logistics/shipmentQuery/shipmentInquiry/saga'
import {
  getShipmentException,
  getShipmentList,
} from 'Redux/logistics/shipmentQuery/shipmentInquiry/action'

describe('shipmentInquiry saga', () => {
  it('maps the backend payload onto camelCase table rows', () =>
    expectSaga(saga)
      .withReducer(reducer)
      .dispatch(
        getShipmentList({
          customerCode: 'MRD1001',
          accountNo: 'SA-88120001',
          shipDateFrom: '2026/05/01',
          shipDateTo: '2026/05/31',
          status: '',
        })
      )
      .silentRun()
      .then(({ storeState }) => {
        expect(storeState.tableDataLoading).toBe(false)
        expect(storeState.tableData.length).toBeGreaterThan(0)
        expect(storeState.tableData[0]).toEqual(
          expect.objectContaining({
            shipmentNo: expect.any(String),
            freightAmount: expect.any(String),
            destination: expect.any(String),
          })
        )
      }))

  it('honours the account filter', () =>
    expectSaga(saga)
      .withReducer(reducer)
      .dispatch(
        getShipmentList({
          customerCode: 'MRD1001',
          accountNo: 'SA-88120003',
          shipDateFrom: '2026/01/01',
          shipDateTo: '2026/12/31',
          status: '',
        })
      )
      .silentRun()
      .then(({ storeState }) => {
        expect(storeState.tableData.every((row) => row.accountNo === 'SA-88120003')).toBe(true)
      }))

  it('returns delivery exceptions and honours the exception reason filter', () =>
    expectSaga(saga)
      .withReducer(reducer)
      .dispatch(
        getShipmentException({
          customerCode: 'MRD1001',
          accountNo: 'SA-88120002',
          shipDateFrom: '2026/01/01',
          shipDateTo: '2026/12/31',
          exceptionReason: '收件人拒收',
        })
      )
      .silentRun()
      .then(({ storeState }) => {
        expect(storeState.tableData).toEqual([
          expect.objectContaining({
            shipmentNo: 'MF26070021',
            accountNo: 'SA-88120002',
            destination: '新竹縣竹北市',
            freightAmount: '2380',
            exceptionReason: '收件人拒收',
          }),
        ])
      }))
})
