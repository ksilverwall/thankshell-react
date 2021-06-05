import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import appReducer from './reducers'
import RootRoutes from './components/app/routing/RootRoute'
import CheckRevision from './containers/CheckRevision'

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
