import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { createStore } from 'redux'
import rootReducer from 'Redux/reducers'

/**
 * Renders with a real store so reducers and selectors are exercised together.
 * Pass `preloadedState` to put the tree into a specific shape.
 */
const renderWithRedux = (ui, { preloadedState, route = '/' } = {}) => {
  const store = createStore(rootReducer, preloadedState)
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  )
  return { store, ...render(ui, { wrapper: Wrapper }) }
}

export * from '@testing-library/react'
export { renderWithRedux }
