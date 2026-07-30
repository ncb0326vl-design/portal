import React from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'Components/dataTable'
import NormalTextField from 'Components/form/NormalTextField'
import { shipmentInquiryTableData, shipmentInquiryTableDataError } from 'Redux/selectors'
import { SHIPMENT_STATUS_NAME, SERVICE_TYPE_NAME } from 'Constants/defaultValues'
import { amountFormat, numberWithCommas } from 'Util/Utils'

const columns = [
  { Header: '託運單號', accessor: 'shipmentNo' },
  { Header: '出貨日期', accessor: 'shipDate' },
  { Header: '託運帳號', accessor: 'accountNo' },
  {
    Header: '服務別',
    accessor: 'serviceType',
    Cell: ({ value }) => SERVICE_TYPE_NAME[value] || value,
  },
  { Header: '出發地', accessor: 'origin' },
  { Header: '目的地', accessor: 'destination' },
  {
    Header: '重量(KG)',
    accessor: 'weightKg',
    alignRight: true,
    Cell: ({ value }) => numberWithCommas(value),
  },
  {
    Header: '運費(TWD)',
    accessor: 'freightAmount',
    alignRight: true,
    sortDescFirst: false,
    sortType: (rowA, rowB, columnId) => Number(rowA.values[columnId]) - Number(rowB.values[columnId]),
    Cell: ({ value }) => amountFormat(value, 'TWD'),
  },
  {
    Header: '狀態',
    accessor: 'status',
    Cell: ({ value }) => SHIPMENT_STATUS_NAME[value] || value,
  },
]

const ShipmentListResult = ({ formSnapshot, onBack }) => {
  const tableData = useSelector(shipmentInquiryTableData)
  const error = useSelector(shipmentInquiryTableDataError)

  return (
    <div>
      <div className="mb-3">
        <NormalTextField label="託運帳號" value={formSnapshot && formSnapshot.accountNo} />
        <NormalTextField
          label="查詢區間"
          value={formSnapshot && `${formSnapshot.shipDateFrom} ～ ${formSnapshot.shipDateTo}`}
        />
      </div>
      <DataTable
        columns={columns}
        data={tableData}
        error={error}
        sortable
        exportFileName="託運單明細"
      />
      <div className="text-center mt-4">
        <button type="button" className="btn btn-outline-secondary px-5" onClick={onBack}>
          重新查詢
        </button>
      </div>
    </div>
  )
}

export default ShipmentListResult
