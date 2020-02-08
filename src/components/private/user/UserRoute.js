import React from 'react'
import { Route } from 'react-router-dom'
import UserConfig from './UserConfig'

const UserRoute = ({user, userLoadingState, auth}) => {
  return (
    <React.Fragment>
      <article className="container-fluid">
        <Route
          path='/user/config'
          extract={true}
          render={(props) => (
            <UserConfig
              {...props}
              user={user}
              auth={auth}
            />
          )}
        />
      </article>
    </React.Fragment>
  )
}

export default UserRoute
