import React from 'react'
import { Alert } from 'react-bootstrap'

import { UserLoadingState } from './actions'
import LogoutButton from './LogoutButton'
import { GetCognitoAuth } from './auth'
import { GetThankshellApi } from './thankshell'

class UserConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: GetCognitoAuth(),
      errorMessage: null,
    }
  }

  componentDidMount() {
    if (this.props.userLoadStatus === UserLoadingState.NOT_LOADED) {
      this.props.loadUser(GetThankshellApi(this.state.auth))
    }
  }

  render() {
    const errorMessage = (this.props.userLoadStatus === UserLoadingState.ERROR)
      ? `Error on loading user data: ${this.props.user.error}`
      : this.state.errorMessage

    const isLoading = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING
    ].includes(this.props.userLoadStatus)

    let userId = '-----'
    if (this.props.userLoadStatus === UserLoadingState.LOADED) {
      if (this.props.user.status === 'UNREGISTERED') {
        this.props.history.push('/groups/sla')
      }

      if (this.props.user.status === 'ENABLE') {
        userId = this.props.user.user_id
      }
    }

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/groups/sla">ホーム </a>
            <a className="nav-item nav-link" href="/user/config">設定</a>
          </div>
        </nav>

        <article className="container-fluid">
          <Alert variant={errorMessage ? "danger" : "primary"}>
            {isLoading ? "読込中・・・" : errorMessage}
          </Alert>
          <h4>ID: {userId}</h4>
          <LogoutButton auth={this.state.auth} />
        </article>
      </React.Fragment>
    )
  }
}

export default UserConfig
