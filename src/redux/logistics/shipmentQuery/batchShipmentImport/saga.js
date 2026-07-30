import { all, call, put, takeLatest } from 'redux-saga/effects'
import axios from 'Util/Auth'
import { PARSE_SHIPMENT_FILE, SUBMIT_BATCH_SHIPMENT } from 'ActionTypes'
import { IMPORT_COLUMNS, validateStagingRow } from './validation'
import {
  parseShipmentFileSuccess,
  parseShipmentFileFailure,
  submitBatchShipmentSuccess,
  submitBatchShipmentFailure,
} from './action'

const MAX_ROWS = 200

const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('檔案讀取失敗'))
    reader.readAsText(file, 'UTF-8')
  })

/** Splits a CSV line on commas, honouring double-quoted fields. */
const splitCsvLine = (line) => {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current)
      current = ''
    } else {
      current += char
    }
  }
  cells.push(current)
  return cells.map((cell) => cell.trim())
}

const parseCsv = (text) => {
  const lines = text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')

  if (!lines.length) throw new Error('檔案內容為空')
  if (lines.length - 1 > MAX_ROWS) throw new Error(`單次匯入筆數不可超過 ${MAX_ROWS} 筆`)

  // First line is the header row and is discarded; column order is fixed by spec.
  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line)
    const row = { rowNo: index + 1 }
    IMPORT_COLUMNS.forEach((col, i) => {
      row[col.field] = cells[i] || ''
    })
    return { ...row, errors: validateStagingRow(row) }
  })
}

const submitBatchShipmentAPI = async (formValue) =>
  IS_DEV_ENV
    ? { messageid: '0', content: { batchno: 'B26072800031', accepted: formValue.shipments.length } }
    : axios.post('/shipment/submitBatchShipment', formValue).then((response) => response.data)

function* parseShipmentFileSaga({ payload }) {
  try {
    const text = yield call(readFileAsText, payload.file)
    const rows = yield call(parseCsv, text)
    yield put(parseShipmentFileSuccess({ fileName: payload.file.name, rows }))
  } catch (error) {
    yield put(parseShipmentFileFailure(error))
  }
}

function* submitBatchShipmentSaga({ payload }) {
  try {
    const response = yield call(submitBatchShipmentAPI, {
      custcode: payload.customerCode,
      shipments: payload.rows.map((row) => ({
        acctno: row.accountNo,
        shipdate: row.shipDate,
        svctype: row.serviceType,
        origin: row.origin,
        dest: row.destination,
        weight: row.weightKg,
        memo: row.memo,
      })),
    })
    if (response.messageid !== '0') throw response

    yield put(submitBatchShipmentSuccess(response.content))
  } catch (error) {
    yield put(submitBatchShipmentFailure(error))
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(PARSE_SHIPMENT_FILE, parseShipmentFileSaga),
    takeLatest(SUBMIT_BATCH_SHIPMENT, submitBatchShipmentSaga),
  ])
}
