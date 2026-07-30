import lazyLoad from 'Components/lazyLoad'

const currentRoute = '/shipment-query'

const shipmentQuery = () => [
  {
    path: `${currentRoute}/shipment-inquiry`,
    Child: lazyLoad(() => import('Pages/logistics/shipmentInquiry')),
  },
  {
    path: `${currentRoute}/batch-shipment-import`,
    Child: lazyLoad(() => import('Pages/logistics/batchShipmentImport')),
  },
]

export default shipmentQuery
