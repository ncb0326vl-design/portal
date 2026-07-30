import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { parseShipmentFile } from 'Redux/actions'
import { batchImportFileName, batchImportParseError } from 'Redux/selectors'
import { IMPORT_COLUMNS } from 'Redux/logistics/shipmentQuery/batchShipmentImport/validation'

const SAMPLE_ROWS = [
  ['SA-88120001', '2026/08/01', 'STANDARD', '台北市內湖區', '桃園市中壢區', '120.5', '八月首批'],
  ['SA-88120002', '2026/08/01', 'EXPRESS', '桃園市大園區', '台中市西屯區', '35', ''],
]

const downloadSample = () => {
  const header = IMPORT_COLUMNS.map((col) => col.header).join(',')
  const body = SAMPLE_ROWS.map((row) => row.join(',')).join('\n')
  const blob = new Blob([`﻿${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '批次託運範例檔.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const ImportFile = () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const fileName = useSelector(batchImportFileName)
  const parseError = useSelector(batchImportParseError)

  const handleChange = (event) => {
    const file = event.target.files[0]
    if (file) dispatch(parseShipmentFile({ file }))
    // Allow re-selecting the same file after a failed parse.
    event.target.value = ''
  }

  return (
    <div className="border rounded p-3 bg-light">
      <div className="d-flex align-items-center flex-wrap">
        <button
          type="button"
          className="btn btn-outline-primary mr-3"
          onClick={() => inputRef.current.click()}
        >
          選擇檔案
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="d-none"
          onChange={handleChange}
        />
        <span className="text-muted">{fileName || '尚未選擇檔案'}</span>
        <button type="button" className="btn btn-link ml-auto" onClick={downloadSample}>
          下載範例檔
        </button>
      </div>
      <div className="small text-muted mt-2">
        欄位順序：{IMPORT_COLUMNS.map((col) => col.header).join('、')}；第一列為標題列。
      </div>
      <If condition={!!parseError}>
        <div className="alert alert-danger py-2 small mt-2 mb-0">
          {parseError.message || '檔案解析失敗'}
        </div>
      </If>
    </div>
  )
}

export default ImportFile
