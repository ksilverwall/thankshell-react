import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import appReducer from 'reducers'
import CheckRevision from 'containers/CheckRevision'

import RootRoutes from './routing/RootRoute'
import LoadEnv from './LoadEnv'
import './App.css'

const App = () => {
  return (
    <Provider store={createStore(appReducer)}>
      <LoadEnv render={(env)=>(
        <>
          <CheckRevision localVersion={env.version} />
          <RootRoutes env={env}/>
        </>
      )}/>
    </Provider>
  )
}

export default App;
