import React from 'react'

import RootRoutes from './routing/RootRoute'
import LoadEnv from './LoadEnv'
import './App.css'
import RevisionUpdateMessage from 'components/RevisionUpdateMessage'
import { BrowserRouter } from 'react-router-dom'


const App = () => {
  return (
    <LoadEnv render={(env)=>(
      <>
        <RevisionUpdateMessage localVersion={env.version || ''} />
        <BrowserRouter>
          <RootRoutes env={env}/>
        </BrowserRouter>
      </>
    )}/>
  )
}

export default App;
