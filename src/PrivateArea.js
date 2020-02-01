import React from 'react';
import { Alert } from 'react-bootstrap'
import { UserLoadingState } from './actions'
import { GetThankshellApi } from './thankshell';

const PrivateContents = (props) => {
  const {renderProps, auth, component: C} = props
  const api = GetThankshellApi(auth)

  if (props.userLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.user.error}</Alert>)
  }

  if (props.userLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.userLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadUser(api)
    return (<h1>Loading...</h1>)
  }

  if (props.user && props.user.status === 'UNREGISTERED') {
    props.history.push('/user/register')

    return (<p>redirecting...</p>)
  }
 
  if (!auth.isUserSignedIn()) {
    return (
      <div>
        <h2>ログインされていません</h2>
      </div>
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
