import React from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'Components/dataTable'
import NormalTextField from 'Components/form/NormalTextField'
import { shipmentInquiryTableData, shipmentInquiryTableDataError } from 'Redux/selectors'
import { formatCurrency } from 'Util/Utils'

const columns = [
  { Header: '託運單號', accessor: 'shipmentNo' },
  { Header: '出貨日期', accessor: 'shipDate' },
  { Header: '託運帳號', accessor: 'accountNo' },
  { Header: '目的地', accessor: 'destination' },
  {
    Header: '運費(TWD)',
    accessor: 'freightAmount',
    alignRight: true,
    Cell: ({ value }) => formatCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  },
  { Header: '異常原因', accessor: 'exceptionReason' },
]

const ShipmentExceptionResult = ({ formSnapshot, onBack }) => {
  const tableData = useSelector(shipmentInquiryTableData)
  const error = useSelector(shipmentInquiryTableDataError)
  const exceptionReason = formSnapshot && formSnapshot.exceptionReason ? formSnapshot.exceptionReason : '全部'

  return (
    <div>
      <div className="mb-3">
        <NormalTextField label="託運帳號" value={formSnapshot && formSnapshot.accountNo} />
        <NormalTextField
          label="查詢區間"
          value={formSnapshot && `${formSnapshot.shipDateFrom} ～ ${formSnapshot.shipDateTo}`}
        />
        <NormalTextField label="異常原因" value={exceptionReason} />
      </div>
      <DataTable
        columns={columns}
        data={tableData}
        error={error}
        exportFileName="配送異常"
      />
      <div className="text-center mt-4">
        <button type="button" className="btn btn-outline-secondary px-5" onClick={onBack}>
          重新查詢
        </button>
      </div>
    </div>
  )
}

export default ShipmentExceptionResult
