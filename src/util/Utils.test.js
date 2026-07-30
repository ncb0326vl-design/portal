import {
  numberWithCommas,
  countInteger,
  countDecimals,
  amountFormat,
  formatCurrency,
  chamelToDash,
} from './Utils'

describe('numberWithCommas', () => {
  it.each([
    [1234567, '1,234,567'],
    ['1234567.89', '1,234,567.89'],
    [0, '0'],
    ['', ''],
    [null, ''],
  ])('formats %p as %p', (input, expected) => {
    expect(numberWithCommas(input)).toBe(expected)
  })
})

describe('countInteger / countDecimals', () => {
  it('counts digits either side of the decimal point', () => {
    expect(countInteger('1234.56')).toBe(4)
    expect(countDecimals('1234.56')).toBe(2)
    expect(countDecimals('1234')).toBe(0)
  })

  it('ignores the minus sign when counting integer digits', () => {
    expect(countInteger('-123')).toBe(3)
  })
})

describe('amountFormat', () => {
  it('drops decimals for TWD', () => {
    expect(amountFormat('3200.4', 'TWD')).toBe('3,200')
  })

  it('keeps two decimals for other currencies', () => {
    expect(amountFormat('3200.4', 'USD')).toBe('3,200.40')
  })

  it('passes non-numeric input straight through', () => {
    expect(amountFormat('N/A')).toBe('N/A')
  })
})

describe('formatCurrency', () => {
  it('adds thousand separators and two decimals', () => {
    expect(formatCurrency('3200.4')).toBe('3,200.40')
  })

  it('supports TWD-style amounts without decimals', () => {
    expect(formatCurrency('3200.4', { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toBe('3,200')
  })

  it('returns an empty string for empty input', () => {
    expect(formatCurrency('')).toBe('')
    expect(formatCurrency(null)).toBe('')
  })
})

describe('chamelToDash', () => {
  it('converts camelCase to kebab-case', () => {
    expect(chamelToDash('shipmentInquiry')).toBe('shipment-inquiry')
  })
})
