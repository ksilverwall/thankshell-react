import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

import Top from './public/Top'
import LoginCallback from './public/LoginCallback'
import { NotFoundPage } from './public/Error'
import { Tos, PrivacyPolicy } from './public/Constants'
import PrivateArea from './private/PrivateArea'

import { GetCognitoAuth } from '../libs/auth'
import { ThankshellApi, RestApi, Session } from '../libs/thankshell'
import LoadGroup from '../containers/LoadGroup'


const RootRoutes = (props) => {
  const auth = GetCognitoAuth()
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path='/groups/:id'
          render={(props) => (
            <PrivateArea auth={auth} location={props.location}>
              <LoadGroup
                {...props}
                auth={auth}
                groupId={props.match.params.id}
                api={
                  new ThankshellApi(
                    new RestApi(new Session(auth), process.env.REACT_APP_THANKSHELL_API_URL)
                  )
                }
              />
            </PrivateArea>
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
