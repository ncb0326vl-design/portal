import {
  validateStagingRow,
  hasRowError,
} from 'Redux/logistics/shipmentQuery/batchShipmentImport/validation'

const validRow = {
  accountNo: 'SA-88120001',
  shipDate: '2026/08/01',
  serviceType: 'STANDARD',
  origin: '台北市內湖區',
  destination: '桃園市中壢區',
  weightKg: '120.5',
  memo: '',
}

describe('validateStagingRow', () => {
  it('accepts a well-formed row', () => {
    expect(validateStagingRow(validRow)).toEqual({})
    expect(hasRowError({ ...validRow, errors: validateStagingRow(validRow) })).toBe(false)
  })

  it('flags every missing required field', () => {
    const errors = validateStagingRow({})
    expect(Object.keys(errors).sort()).toEqual(
      ['accountNo', 'destination', 'origin', 'serviceType', 'shipDate', 'weightKg'].sort()
    )
  })

  it('rejects a malformed date', () => {
    expect(validateStagingRow({ ...validRow, shipDate: '2026-08-01' }).shipDate).toBe(
      '出貨日期格式須為 YYYY/MM/DD'
    )
  })

  it('rejects an unknown service type', () => {
    expect(validateStagingRow({ ...validRow, serviceType: 'DRONE' }).serviceType).toBeTruthy()
  })

  it.each([['0'], ['-5'], ['abc']])('rejects weight %p', (weightKg) => {
    expect(validateStagingRow({ ...validRow, weightKg }).weightKg).toBe('重量須為大於 0 的數字')
  })

  it('rejects a memo longer than 20 characters', () => {
    expect(validateStagingRow({ ...validRow, memo: '一'.repeat(21) }).memo).toBeTruthy()
  })
})
