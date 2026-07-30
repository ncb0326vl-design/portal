import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { kebabCase, includes } from 'lodash'

import { userFunctions, isLoggedIn } from 'Redux/selectors'
import ErrorBoundary from 'Components/errorBoundary'
import LoadingPrompt from 'Components/loading'
import Home from 'Pages/home'
import routes from 'Routes'

/**
 * Flattens the login response's `functions` tree into the list of route paths the
 * current user is allowed to see, e.g. ['/logistics/shipment-query/shipment-inquiry'].
 */
const toRoutePermissions = (functions) => {
  const paths = []
  functions.forEach((level1) => {
    ;(level1.children || []).forEach((level2) => {
      ;(level2.children || []).forEach((level3) => {
        paths.push(`/${kebabCase(level1.id)}/${kebabCase(level2.id)}/${kebabCase(level3.id)}`)
      })
    })
  })
  return paths
}

const App = ({ store }) => {
  const functions = useSelector(userFunctions)
  const loggedIn = useSelector(isLoggedIn)
  const routePermissions = toRoutePermissions(functions)
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPrompt text="頁面載入中…" />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <For each="route" of={routes(store)}>
            <If condition={includes(routePermissions, route.path)}>
              <Route key={route.path} path={route.path} component={route.Child} />
            </If>
          </For>
          <If condition={!loggedIn}>
            <Redirect to="/" />
          </If>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
