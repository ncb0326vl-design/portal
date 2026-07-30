import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import SelectionField from 'Components/form/SelectionField'
import DateRangeSelection from 'Components/form/DateRangeSelection'
import RadioSelectionField from 'Components/form/RadioSelectionField'
import { getShippingAccounts } from 'Redux/actions'
import { customers, customersLoading, shippingAccounts, shippingAccountsLoading } from 'Redux/selectors'
import { MAX_QUERY_DAYS, SHIPMENT_STATUS } from 'Constants/defaultValues'
import { toSelectOptions } from 'Util/Utils'

const DATE_FORMAT = 'YYYY/MM/DD'

const validationSchema = Yup.object({
  customerCode: Yup.string().required('請選擇客戶'),
  accountNo: Yup.string().required('請選擇託運帳號'),
  shipDateFrom: Yup.string().required('請選擇查詢起日'),
  shipDateTo: Yup.string()
    .required('請選擇查詢迄日')
    .test('after-start', '查詢迄日不可早於起日', function checkOrder(value) {
      const { shipDateFrom } = this.parent
      if (!value || !shipDateFrom) return true
      return dayjs(value, DATE_FORMAT).isSame(dayjs(shipDateFrom, DATE_FORMAT)) ||
        dayjs(value, DATE_FORMAT).isAfter(dayjs(shipDateFrom, DATE_FORMAT))
    })
    .test('within-range', `查詢區間不可超過 ${MAX_QUERY_DAYS} 天`, function checkRange(value) {
      const { shipDateFrom } = this.parent
      if (!value || !shipDateFrom) return true
      return dayjs(value, DATE_FORMAT).diff(dayjs(shipDateFrom, DATE_FORMAT), 'day') <= MAX_QUERY_DAYS
    }),
})

const ShipmentListSearch = ({ onSearch }) => {
  const dispatch = useDispatch()
  const customerList = useSelector(customers)
  const customerListLoading = useSelector(customersLoading)
  const accountList = useSelector(shippingAccounts)
  const accountListLoading = useSelector(shippingAccountsLoading)

  const formik = useFormik({
    initialValues: {
      customerCode: '',
      accountNo: '',
      shipDateFrom: dayjs().subtract(30, 'day').format(DATE_FORMAT),
      shipDateTo: dayjs().format(DATE_FORMAT),
      status: '',
    },
    validationSchema,
    onSubmit: onSearch,
  })

  const handleCustomerSelected = (option) => {
    // Clear without re-validating: SelectionField has already validated against the new
    // customer, and a second validation here would run against pre-selection values.
    formik.setFieldValue('accountNo', '', false)
    if (option) dispatch(getShippingAccounts({ customerCode: option.value }))
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <SelectionField
        formik={formik}
        fieldName="customerCode"
        label="客戶"
        required
        isLoading={customerListLoading}
        options={toSelectOptions(customerList, { value: 'customerCode', label: 'customerName' })}
        onSelected={handleCustomerSelected}
      />
      <SelectionField
        formik={formik}
        fieldName="accountNo"
        label="託運帳號"
        required
        isLoading={accountListLoading}
        isDisabled={!formik.values.customerCode}
        options={accountList.map((item) => ({
          value: item.accountNo,
          label: `${item.accountNo}　${item.accountName}`,
        }))}
      />
      <DateRangeSelection
        formik={formik}
        startFieldName="shipDateFrom"
        endFieldName="shipDateTo"
        label="出貨日期"
        required
      />
      <RadioSelectionField
        formik={formik}
        fieldName="status"
        label="託運狀態"
        options={SHIPMENT_STATUS}
      />
      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary px-5">
          查詢
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary px-4 ml-2"
          onClick={() => formik.resetForm()}
        >
          清除
        </button>
      </div>
    </form>
  )
}

export default ShipmentListSearch
