import logistics from './logistics'

/**
 * `store` is threaded through so route groups can inject reducers/sagas lazily if they
 * ever need to. Today every area is registered statically in Redux/reducers.js.
 */
const routes = (store) => [...logistics(store)]

export default routes
