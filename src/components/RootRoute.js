import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

import Top from './public/Top.js'
import LoginCallback from './public/LoginCallback.js'
import { NotFoundPage } from './public/Error.js'
import { Tos, PrivacyPolicy } from './public/Constants.js'
import PrivateArea from './private/PrivateArea.js'

import { GetCognitoAuth } from '../libs/auth.js'


const RootRoutes = (props) => {
  const auth = GetCognitoAuth()
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path='/groups/:id'
          render={(props) => (
            <PrivateArea renderProps={props} auth={auth}/>
          )}
        />
        {
          [
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
          ].map(({path, extract, component}, index) => (
            <Route key={`global_${index}`} path={path} exact={extract} component={component} />
          ))
        }
        <Route path='*' component={NotFoundPage} />
      </Switch>
      <footer className="footer">
        <Link to="/">TOP</Link>
        <Link to="/tos">利用規約</Link>
        <Link to="/privacy-policy">プライバシーポリシー</Link>
      </footer>
    </BrowserRouter>
  )
}

export default RootRoutes 
