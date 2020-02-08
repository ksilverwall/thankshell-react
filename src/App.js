import React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

import Top from './components/public/Top.js'
import LoginCallback from './components/public/LoginCallback.js'
import { NotFoundPage } from './components/public/Error.js'
import { Tos, PrivacyPolicy } from './components/public/Constants.js'
import UserRoute from './components/private/user/UserRoute.js'

import appReducer from './reducers'
import LoadGroup from './containers/LoadGroup.js'
import LoadPrivate from './containers/LoadPrivate.js'

import { GetCognitoAuth } from './libs/auth.js'

import './App.css'

const routes = {
  private: [
    {
      path: '/user',
      extract: false,
      component: UserRoute,
    },
    {
      path: '/groups/:id',
      extract: false,
      component: LoadGroup,
    },
  ],
  public: [
    {
      path: '/',
      extract: true,
      component: Top,
    },
    {
      path: '/tos',
      extract: true,
      component: Tos,
    },
    {
      path: '/privacy-policy',
      extract: true,
      component: PrivacyPolicy,
    },
    {
      path: '/login/callback',
      extract: true,
      component: LoginCallback,
    },
  ],
}

const MainRoutes = (props) => {
  const auth = GetCognitoAuth()
  return (
    <Switch>
      {
        routes.private.map(({path, extract, component}) => (
          <Route
            path={path}
            extract={extract}
            render={(props) => (<LoadPrivate renderProps={props} auth={auth} component={component}/>)}
          />
        ))
      }
      {
        routes.public.map(({path, extract, component}) => (
          <Route path={path} exact={extract} component={component} />
        ))
      }
      <Route path='*' component={NotFoundPage} />
    </Switch>
  )
}

const App = () => {
  return (
    <Provider store={createStore(appReducer)}>
      <BrowserRouter>
        <main>
          <MainRoutes />
        </main>
        <footer className="footer">
          <Link to="/">TOP</Link>
          <Link to="/tos">利用規約</Link>
          <Link to="/privacy-policy">プライバシーポリシー</Link>
        </footer>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
