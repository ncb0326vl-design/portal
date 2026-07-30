import { SERVICE_TYPE_NAME } from 'Constants/defaultValues'

export const IMPORT_COLUMNS = [
  { field: 'accountNo', header: '託運帳號', required: true },
  { field: 'shipDate', header: '出貨日期', required: true },
  { field: 'serviceType', header: '服務別', required: true },
  { field: 'origin', header: '出發地', required: true },
  { field: 'destination', header: '目的地', required: true },
  { field: 'weightKg', header: '重量(KG)', required: true },
  { field: 'memo', header: '備註', required: false },
]

const DATE_PATTERN = /^\d{4}\/\d{2}\/\d{2}$/

/** Returns { field: message } for whatever is wrong with a single staged row. */
export const validateStagingRow = (row) => {
  const errors = {}

  IMPORT_COLUMNS.filter((col) => col.required).forEach((col) => {
    if (!row[col.field]) errors[col.field] = `${col.header}為必填`
  })

  if (row.shipDate && !DATE_PATTERN.test(row.shipDate)) {
    errors.shipDate = '出貨日期格式須為 YYYY/MM/DD'
  }
  if (row.serviceType && !SERVICE_TYPE_NAME[row.serviceType]) {
    errors.serviceType = '服務別須為 STANDARD／EXPRESS／COLD_CHAIN'
  }
  if (row.weightKg && (Number.isNaN(Number(row.weightKg)) || Number(row.weightKg) <= 0)) {
    errors.weightKg = '重量須為大於 0 的數字'
  }
  if (row.memo && row.memo.length > 20) {
    errors.memo = '備註長度不可超過 20 字'
  }

  return errors
}

export const hasRowError = (row) => Object.keys(row.errors || {}).length > 0
