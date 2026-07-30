export const SHIPMENT_STATUS = [
  { value: '', label: '全部' },
  { value: 'PENDING', label: '待出貨' },
  { value: 'IN_TRANSIT', label: '運送中' },
  { value: 'DELIVERED', label: '已送達' },
  { value: 'EXCEPTION', label: '異常' },
]

export const SHIPMENT_STATUS_NAME = SHIPMENT_STATUS.reduce((acc, item) => {
  if (item.value) acc[item.value] = item.label
  return acc
}, {})

export const SHIPMENT_EXCEPTION_REASON = [
  { value: '', label: '全部' },
  { value: '收件人地址不符', label: '收件人地址不符' },
  { value: '溫層異常', label: '溫層異常' },
  { value: '包裝破損', label: '包裝破損' },
  { value: '道路中斷延誤', label: '道路中斷延誤' },
  { value: '收件人拒收', label: '收件人拒收' },
]

export const SERVICE_TYPE = [
  { value: 'STANDARD', label: '標準' },
  { value: 'EXPRESS', label: '快捷' },
  { value: 'COLD_CHAIN', label: '冷鏈' },
]

export const SERVICE_TYPE_NAME = SERVICE_TYPE.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

export const DEFAULT_PAGE_SIZE = 10

/** 查詢區間上限（天）。各查詢頁的日期驗證請統一使用此常數。 */
export const MAX_QUERY_DAYS = 92
