import React from 'react';
import { Alert } from 'react-bootstrap'

import { UserLoadingState } from '../../actions'
import RegisterUser from '../../containers/RegisterUser.js'

import { GetThankshellApi } from '../../libs/thankshell.js';


const PrivateContents = (props) => {
  const {renderProps, auth, component: C} = props
  const api = GetThankshellApi(auth)

  if (!auth.isUserSignedIn()) {
    return (
      <div>
        <h2>ログインされていません</h2>
      </div>
    )
  }

  if (props.errorMessage) {
    return (<Alert>ERROR: {props.errorMessage}</Alert>)
  }

  if (props.reloadUser) {
    props.loadUser(api)
  }

  if (props.openRegisterUser) {
    const isStandby = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING,
      UserLoadingState.SAVING,
    ].includes(props.userLoadingState)

    return (
      <RegisterUser
        {...props}
        api={api}
        disabled={isStandby}
      />
    )
  }

  return (<C {...renderProps} {...props} />)
}

const PrivateArea = (props) => {
  return (
    <React.Fragment>
      <header>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/groups/sla">ホーム </a>
            <a className="nav-item nav-link" href="/user/config">設定</a>
          </div>
        </nav>
      </header>
      <PrivateContents {...props} />
    </React.Fragment>
  )
}

export default PrivateArea
