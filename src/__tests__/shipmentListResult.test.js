import React from 'react'
import { fireEvent, renderWithRedux, screen, within } from 'JestUtil/withRedux'
import ShipmentListResult from 'Pages/logistics/shipmentInquiry/shipmentListTab/ShipmentListResult'

const freightAmounts = [
  '3200',
  '2850',
  '11400',
  '9750',
  '2100',
  '1650',
  '8300',
  '2450',
  '1980',
  '4100',
  '3450',
  '9600',
]

const tableData = freightAmounts.map((freightAmount, index) => ({
  shipmentNo: `MF2605${String(index + 1).padStart(4, '0')}`,
  shipDate: '2026/05/01',
  accountNo: 'SA-88120001',
  serviceType: 'STANDARD',
  origin: '台北市內湖區',
  destination: '桃園市中壢區',
  weightKg: '10',
  freightAmount,
  status: 'DELIVERED',
}))

const renderResult = () =>
  renderWithRedux(
    <ShipmentListResult
      formSnapshot={{
        accountNo: 'SA-88120001',
        shipDateFrom: '2026/05/01',
        shipDateTo: '2026/05/31',
      }}
      onBack={jest.fn()}
    />,
    {
      preloadedState: {
        logistics: {
          shipmentQuery: {
            shipmentInquiry: {
              tableData,
              tableDataLoading: false,
              tableDataError: null,
            },
          },
        },
      },
    }
  )

const currentFreightCells = () => {
  const rows = screen.getAllByRole('row').slice(1)
  return rows.map((row) => within(row).getAllByRole('cell')[7].textContent)
}

describe('ShipmentListResult', () => {
  it('sorts freight amounts ascending and descending while pagination continues the sorted order', () => {
    renderResult()

    const freightHeader = screen.getByRole('columnheader', { name: /運費\(TWD\)/ })

    fireEvent.click(freightHeader)

    expect(freightHeader).toHaveTextContent('▲')
    expect(currentFreightCells()).toEqual([
      '1,650',
      '1,980',
      '2,100',
      '2,450',
      '2,850',
      '3,200',
      '3,450',
      '4,100',
      '8,300',
      '9,600',
    ])

    fireEvent.click(screen.getByRole('button', { name: '下一頁' }))

    expect(currentFreightCells()).toEqual(['9,750', '11,400'])

    fireEvent.click(freightHeader)

    expect(freightHeader).toHaveTextContent('▼')
    expect(currentFreightCells()).toEqual([
      '11,400',
      '9,750',
      '9,600',
      '8,300',
      '4,100',
      '3,450',
      '3,200',
      '2,850',
      '2,450',
      '2,100',
    ])

    fireEvent.click(screen.getByRole('button', { name: '下一頁' }))

    expect(currentFreightCells()).toEqual(['1,980', '1,650'])
  })
})
