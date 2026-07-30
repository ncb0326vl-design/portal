import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'Assets/css/styles.css'

import configureStore from 'Redux/store'
import App from './app'

const store = configureStore()

const container = document.getElementById('root')
createRoot(container).render(
  <Provider store={store}>
    <BrowserRouter>
      <App store={store} />
    </BrowserRouter>
  </Provider>
)
