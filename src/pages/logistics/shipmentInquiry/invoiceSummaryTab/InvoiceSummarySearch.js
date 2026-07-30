import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SelectionField from 'Components/form/SelectionField'
import { getShippingAccounts } from 'Redux/actions'
import { customers, customersLoading, shippingAccounts, shippingAccountsLoading } from 'Redux/selectors'
import { toSelectOptions } from 'Util/Utils'

const BILL_MONTHS = ['2026/05', '2026/06', '2026/07']

const validationSchema = Yup.object({
  customerCode: Yup.string().required('請選擇客戶'),
  accountNo: Yup.string().required('請選擇託運帳號'),
  billMonthFrom: Yup.string().required('請選擇帳務月份起'),
  billMonthTo: Yup.string()
    .required('請選擇帳務月份迄')
    .test('after-start', '帳務月份迄不可早於起', function checkOrder(value) {
      const { billMonthFrom } = this.parent
      if (!value || !billMonthFrom) return true
      return value >= billMonthFrom
    }),
})

const InvoiceSummarySearch = ({ onSearch }) => {
  const dispatch = useDispatch()
  const customerList = useSelector(customers)
  const customerListLoading = useSelector(customersLoading)
  const accountList = useSelector(shippingAccounts)
  const accountListLoading = useSelector(shippingAccountsLoading)

  const formik = useFormik({
    initialValues: {
      customerCode: '',
      accountNo: '',
      billMonthFrom: BILL_MONTHS[0],
      billMonthTo: BILL_MONTHS[BILL_MONTHS.length - 1],
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

  const monthOptions = BILL_MONTHS.map((month) => ({ value: month, label: month }))

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
      <SelectionField formik={formik} fieldName="billMonthFrom" label="帳務月份起" required options={monthOptions} />
      <SelectionField formik={formik} fieldName="billMonthTo" label="帳務月份迄" required options={monthOptions} />
      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary px-5">
          查詢
        </button>
      </div>
    </form>
  )
}

export default InvoiceSummarySearch
