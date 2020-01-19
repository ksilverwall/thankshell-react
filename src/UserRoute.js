import React from 'react'
import { Route } from 'react-router-dom'
import RegisterUser from './containers/RegisterUser'
import LoadUser from './containers/LoadUser'

const UserRoute = (props) => {
  const routes = [
    {
      path: '/user/register',
      extract: true,
      component: RegisterUser,
    },
    {
      path: '/user/config',
      extract: true,
      component: LoadUser,
    },
  ]
  return (
    <React.Fragment>
      {
        routes.map(({path, extract, component}) => (
          <Route
            path={path}
            extract={extract}
            component={component}
          />
        ))
      }
    </React.Fragment>
  )
}

export default UserRoute
