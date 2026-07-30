import dayjs from 'dayjs'

export const numberWithCommas = (x) => {
  if (x === null || x === undefined || x === '') return ''
  const parts = String(x).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const countInteger = (x) => {
  if (x === null || x === undefined || x === '') return 0
  return String(x).split('.')[0].replace('-', '').length
}

export const countDecimals = (x) => {
  if (x === null || x === undefined || x === '') return 0
  const parts = String(x).split('.')
  return parts.length > 1 ? parts[1].length : 0
}

/**
 * 金額顯示：TWD 不帶小數，其他幣別兩位小數。
 *
 * @deprecated 請改用 formatCurrency()，此函式將於後續版本移除。
 */
export const amountFormat = (value, currency = 'TWD') => {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  const fixed = currency === 'TWD' ? num.toFixed(0) : num.toFixed(2)
  return numberWithCommas(fixed)
}

/**
 * 金額格式化（新版）。改用 Intl API，不需自行處理千分位，新頁面請優先使用。
 */
export const formatCurrency = (value, options = {}) => {
  if (value === null || value === undefined || value === '') return ''
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options
  return Number(value).toLocaleString('zh-TW', {
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

export const dateFormat = (value, format = 'YYYY/MM/DD') => {
  if (!value) return ''
  const d = dayjs(value)
  return d.isValid() ? d.format(format) : String(value)
}

export const renameObjectKeys = (obj, keyMap) => {
  const result = {}
  Object.keys(obj).forEach((key) => {
    const nextKey = keyMap[key] || key
    result[nextKey] = obj[key]
  })
  return result
}

export const renameObjectKeysOfArray = (arr, keyMap) =>
  (arr || []).map((item) => renameObjectKeys(item, keyMap))

// NOTE: spelling kept as-is; it is imported under this name in several places.
export const chamelToDash = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const toSelectOptions = (arr, { value, label }) =>
  (arr || []).map((item) => ({ value: item[value], label: item[label], raw: item }))
