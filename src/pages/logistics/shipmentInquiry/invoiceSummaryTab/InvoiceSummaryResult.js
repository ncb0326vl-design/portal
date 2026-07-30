import React from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'Components/dataTable'
import NormalTextField from 'Components/form/NormalTextField'
import { shipmentInquiryTableData, shipmentInquiryTableDataError } from 'Redux/selectors'
import { amountFormat, numberWithCommas } from 'Util/Utils'

const columns = [
  { Header: '帳務月份', accessor: 'billMonth' },
  { Header: '託運帳號', accessor: 'accountNo' },
  {
    Header: '託運件數',
    accessor: 'shipmentCount',
    alignRight: true,
    Cell: ({ value }) => numberWithCommas(value),
  },
  {
    Header: '總重量(KG)',
    accessor: 'totalWeightKg',
    alignRight: true,
    Cell: ({ value }) => numberWithCommas(value),
  },
  {
    Header: '總運費(TWD)',
    accessor: 'totalFreightAmount',
    alignRight: true,
    Cell: ({ value }) => amountFormat(value, 'TWD'),
  },
  { Header: '結帳狀態', accessor: 'billStatus' },
]

const InvoiceSummaryResult = ({ formSnapshot, onBack }) => {
  const tableData = useSelector(shipmentInquiryTableData)
  const error = useSelector(shipmentInquiryTableDataError)

  return (
    <div>
      <div className="mb-3">
        <NormalTextField label="託運帳號" value={formSnapshot && formSnapshot.accountNo} />
        <NormalTextField
          label="帳務月份"
          value={formSnapshot && `${formSnapshot.billMonthFrom} ～ ${formSnapshot.billMonthTo}`}
        />
      </div>
      <DataTable
        columns={columns}
        data={tableData}
        error={error}
        exportFileName="請款彙總"
      />
      <div className="text-center mt-4">
        <button type="button" className="btn btn-outline-secondary px-5" onClick={onBack}>
          重新查詢
        </button>
      </div>
    </div>
  )
}

export default InvoiceSummaryResult
