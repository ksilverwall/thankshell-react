import React from 'react'
import { Route } from 'react-router-dom'
import UserRegister from './UserRegister'
import UserConfig from './UserConfig'
import { UserLoadingState } from './actions'
import { GetThankshellApi } from './thankshell'

const UserRoute = ({user, userLoadingState, auth}) => {
  const isStandby = [
    UserLoadingState.NOT_LOADED,
    UserLoadingState.LOADING,
    UserLoadingState.SAVING,
  ].includes(userLoadingState)

  return (
    <React.Fragment>
      <article className="container-fluid">
        <Route
          path='/user/register'
          extract={true}
          render={props => (
            <UserRegister
              {...props}
              api={GetThankshellApi(auth)}
              user={user}
              disabled={isStandby}
            />
          )}
        />
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
