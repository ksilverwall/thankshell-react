import React from 'react'
import { Route } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import UserRegister from './UserRegister'
import UserConfig from './UserConfig'
import { UserLoadingState } from './actions'
import { GetThankshellApi } from './thankshell'

const UserRoute = ({user, userLoadStatus, loadUser, auth}) => {
    const api = GetThankshellApi(auth)

    if (userLoadStatus === UserLoadingState.NOT_LOADED) {
      loadUser(api)
    }

    const isLoading = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING,
    ].includes(userLoadStatus)

    const isStandby = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING,
      UserLoadingState.SAVING,
    ].includes(userLoadStatus)

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/groups/sla">ホーム </a>
            <a className="nav-item nav-link" href="/user/config">設定</a>
          </div>
        </nav>
        <article className="container-fluid">
          {
            (userLoadStatus === UserLoadingState.ERROR)
              ? (
                <Alert variant="danger">
                  Error on loading user data: {(user && user.error) ? user.error : null}
                </Alert>
              )
              : null
          }
          {
            isLoading ? (
              <Alert variant="primary">"読込中・・・"</Alert>
            ) : null
          }
          <Route
            path='/user/register'
            extract={true}
            render={props => (
              <UserRegister
                {...props}
                api={api}
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
