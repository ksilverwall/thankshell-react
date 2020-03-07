import React from 'react'
import { Route } from 'react-router-dom'
import UpdateUser from '../../../containers/UpdateUser.js'
import { GetThankshellApi } from '../../../libs/thankshell.js'

const UserRoute = ({user, auth}) => {
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
              api={GetThankshellApi(auth)}
            />
          )}
        />
      </article>
    </React.Fragment>
  )
}

export default UserRoute
