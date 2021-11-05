import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import RootRoutes from './routing/RootRoute'
import './App.css'


const App = () => (
  <BrowserRouter>
    <RootRoutes/>
  </BrowserRouter>
);

export default App;
