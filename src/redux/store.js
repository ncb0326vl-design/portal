import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import rootSaga from './sagas'
import { loginSuccess } from './auth/login/action'
import { readDevSession } from './auth/login/devSession'

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers =
    (USE_CONSOLE && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))
  let sagaTask = sagaMiddleware.run(rootSaga)

  // Makes this module the HMR boundary for the whole redux tree.
  //
  // react-refresh only self-accepts modules that export nothing but React components, so
  // a reducer/saga/action edit has no boundary of its own and bubbles up its import chain
  // looking for one. Every such chain runs through this file and on to the entry, which
  // accepts nothing — webpack then gives up and falls back to a full page reload, which is
  // what rebuilds the store from scratch. Accepting here stops the bubbling one module
  // short of that, so no reload happens and the live store is simply patched in place.
  //
  // Every local import in this file needs an accept, or that one dependency becomes a path
  // to the entry again and reloads come back. Add an accept alongside any import you add.
  // Webpack resolves these paths at build time against *this* file, so the calls have to
  // stay inline — they cannot move into a shared helper.
  if (module.hot) {
    // combineReducers keeps the state of every key it already has, so the live tree
    // survives; only keys the new reducer adds start from their initial state.
    module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers').default))

    module.hot.accept('./sagas', () => {
      const nextRootSaga = require('./sagas').default
      const restart = () => {
        sagaTask = sagaMiddleware.run(nextRootSaga)
      }
      sagaTask.cancel()
      // Wait for the old watchers to unwind before starting the new ones, or both sets
      // race on the same actions. Restart on rejection too, so a root saga that already
      // crashed doesn't leave the app with no watchers at all.
      sagaTask.toPromise().then(restart, restart)
    })

    // The session replay below reads these two once, at boot, and never again — so there
    // is nothing for this file to re-apply and the accept needs no callback. It is here
    // purely so an edit that reaches them stops travelling: `loginSuccess` imports
    // ActionTypes, which every new action type touches. Their real consumers (the login
    // saga, the components) still get the update through their own boundaries.
    module.hot.accept(['./auth/login/action', './auth/login/devSession'])
  }

  // Replay the cached login so a dev-server reload lands back on the page you were on
  // instead of the login form. Reuses the reducer rather than hand-building the slice;
  // nothing watches LOGIN_SUCCESS, so this triggers no extra requests.
  const devSession = readDevSession()
  if (devSession) store.dispatch(loginSuccess(devSession))

  return store
}

export default configureStore
