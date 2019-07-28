import React from 'react';
import './App.css';
import Top from './Top.js'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

const App = () => (
  <BrowserRouter>
    <main>
      <Switch>
        <Route exact path='/' component={Top} />
        <Route exact path='/tos' component={Tos} />
        <Route exact path='/privacy-policy' component={PrivacyPolicy} />
        <Route path='/' component={NotFoundPage} />
      </Switch>
    </main>
    <footer className="footer">
      <Link to="/">TOP</Link>
      <Link to="/tos">利用規約</Link>
      <Link to="/privacy-policy">プライバシーポリシー</Link>
    </footer>
  </BrowserRouter>
)

const Tos = () => (
  <h1>Dummy Page</h1>
)

const PrivacyPolicy = () => (
  <h1>Dummy Page</h1>
)

const NotFoundPage = () => (
  <h1>Page Not Found</h1>
)

export default App;
