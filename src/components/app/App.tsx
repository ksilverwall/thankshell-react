import React from 'react'

import RootRoutes from './routing/RootRoute'
import LoadEnv from './LoadEnv'
import './App.css'
import RevisionUpdateMessage from 'components/RevisionUpdateMessage'

const App = () => {
  return (
    <LoadEnv render={(env)=>(
      <>
        <RevisionUpdateMessage localVersion={env.version || ''} />
        <RootRoutes env={env}/>
      </>
    )}/>
  )
}

export default App;
