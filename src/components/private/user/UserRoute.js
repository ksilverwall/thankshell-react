import React from 'react'
import { Route } from 'react-router-dom'
import UpdateUser from '../../../containers/UpdateUser.js'

const UserRoute = ({user, auth, api}) => {
  return (
    <React.Fragment>
      <article className="container-fluid">
        <Route
          path='/user/config'
          extract={true}
          render={(props) => (
            <UpdateUser
              {...props}
              user={user}
              auth={auth}
              api={api}
            />
          )}
        />
      </article>
    </React.Fragment>
  )
}

export default UserRoute
