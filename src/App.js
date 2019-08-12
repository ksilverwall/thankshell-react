import React from 'react';
import './App.css';
import Top from './Top.js'
import LoginCallback from './LoginCallback.js'
import GroupsRouter from './GroupsRouter.js'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { NotFoundPage } from './Error.js'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/groups' component={GroupsRouter} />
      <Route path='/' component={VisitorAreaRouter} />
    </Switch>
  </BrowserRouter>
)

const VisitorAreaRouter = () => (
  <React.Fragment>
    <main>
      <Switch>
        <Route exact path='/' component={Top} />
        <Route exact path='/tos' component={Tos} />
        <Route exact path='/privacy-policy' component={PrivacyPolicy} />
        <Route exact path='/login/callback' component={LoginCallback} />
        <Route path='/' component={NotFoundPage} />
      </Switch>
    </main>
    <footer className="footer">
      <Link to="/">TOP</Link>
      <Link to="/tos">利用規約</Link>
      <Link to="/privacy-policy">プライバシーポリシー</Link>
    </footer>
  </React.Fragment>
)

const Tos = () => (
  <h1>Dummy Page</h1>
)

const PrivacyPolicy = () => (
  <h1>Dummy Page</h1>
)

export default App;
