import React from 'react';
import { Route } from 'react-router-dom'
import { GetCognitoAuth } from './auth'

const GotoTop = () => (
  <div>
    <h2>ログインされていません</h2>
  </div>
)

const PrivateRoute = ({path, extract, component: C}) => {
  const auth = GetCognitoAuth()
  return auth.isUserSignedIn() ? (
    <Route
      path={path}
      extract={extract}
      render={(props) => <C {...props} auth={auth} />}
    />
  ) : (
    <Route
      path={path}
      extract={extract}
      component={GotoTop}
    />
  )
}

export default PrivateRoute
