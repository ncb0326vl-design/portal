import shipmentQuery from './shipmentQuery'

const currentRoute = '/logistics'

const logistics = (store) =>
  shipmentQuery(store).map((route) => ({ ...route, path: `${currentRoute}${route.path}` }))

export default logistics
