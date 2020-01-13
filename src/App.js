import React from 'react';
import './App.css';
import Top from './Top.js'
import LoginCallback from './LoginCallback.js'
import GroupsRouter from './GroupsRouter.js'
import UserRegister from './UserRegister.js'
import UserConfig from './UserConfig.js'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { NotFoundPage } from './Error.js'
import PrivateRoute from './PrivateRoute.js'

import appReducer from './reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const App = () => (
  <Provider store={createStore(appReducer)}>
    <BrowserRouter>
      <Switch>
        <PrivateRoute extract path='/user/register' component={UserRegister} />
        <PrivateRoute extract path='/user/config' component={UserConfig} />
        <PrivateRoute path='/groups' component={GroupsRouter} />
        <Route path='/' component={VisitorAreaRouter} />
      </Switch>
    </BrowserRouter>
  </Provider>
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

class Tos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
    this.loadText('/text/tos.md')
  }

  async loadText(path) {
    let response = await fetch(path)
    this.setState({
      text: await response.text(),
    })
  }

  render() {
    return (
      <article style={{background: 'white', margin:'20px', padding:'10px'}}>
        <ReactMarkdown source={this.state.text} />
      </article>
    )
  }
}

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
    this.loadText('/text/privacy-policy.md')
  }

  async loadText(path) {
    let response = await fetch(path)
    this.setState({
      text: await response.text(),
    })
  }

  render() {
    return (
      <article style={{background: 'white', margin:'20px', padding:'10px'}}>
        <ReactMarkdown source={this.state.text} />
      </article>
    )
  }
}

export default App;
