import React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import Top from './Top'
import LoginCallback from './LoginCallback'
import { NotFoundPage } from './Error'
import { Tos, PrivacyPolicy } from './Constants'

import appReducer from './reducers'
import LoadUser from './containers/LoadUser';
import LoadGroup from './containers/LoadGroup';

import './App.css'

const routes = {
  private: [
    {
      path: '/user',
      extract: false,
      component: LoadUser,
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
  return (
    <Switch>
      {
        routes.private.map(({path, extract, component}) => (
          <PrivateRoute
            path={path}
            extract={extract}
            component={component}
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
