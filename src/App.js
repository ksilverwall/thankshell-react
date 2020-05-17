import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import appReducer from './reducers'
import RootRoutes from './components/RootRoute.js'
import CheckRevision from './containers/CheckRevision.js'

import './App.css'

const App = () => {
  return (
    <Provider store={createStore(appReducer)}>
      <CheckRevision localVersion={process.env.REACT_APP_VERSION} />
      <RootRoutes />
    </Provider>
  )
}

export default App;
