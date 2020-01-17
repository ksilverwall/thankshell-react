import React from 'react'
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap'

import { UserLoadingState } from './actions'

import { GetCognitoAuth } from './auth'
import { GetThankshellApi } from './thankshell.js'


class UserRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: GetThankshellApi(GetCognitoAuth()),
      user: null,
      errorMessage: null,
    };
  }

  render() {
    const errorMessage = this.getErrorMessage()
    const isLoading = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING
    ].includes(this.props.userLoadStatus)

    if (this.props.userLoadStatus === UserLoadingState.NOT_LOADED) {
      this.props.loadUser(this.state.api)
    }

    if (this.props.userLoadStatus === UserLoadingState.LOADED) {
      if (this.props.user.status !== 'UNREGISTERED') {
        this.props.history.push('/groups/sla')
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
          <UserRegisterForm
            {...this.props}
            api={this.state.api}
            disabled={this.props.userLoadStatus === UserLoadingState.SAVING || isLoading}
          />
        </article>
      </React.Fragment>
    )
  }

  getErrorMessage() {
    if (this.props.userLoadStatus === UserLoadingState.ERROR) {
      return `Error on loading user data: ${this.props.user.error}`
    }
    if (this.props.userRegisterError) {
      return this.props.userRegisterError
    }

    return this.state.errorMessage
  }
}

class UserRegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      checked: false,
    };
  }

  render() {
    return (
      <form className="form-horizontal">
        <div className="form-group">
          <label for="user-id">ID</label>
          <input
           className="form-control"
           type="text"
           value={this.state.userId}
           onChange={e=>this.setState({userId: e.target.value})} />
        </div>
        <div className="form-check">
          <input
           className="form-check-input"
           type="checkbox"
           checked={this.state.checked}
           onChange={e=>this.setState({checked: e.target.checked})} />
          <label className="form-check-label" for="agree-check">
            <a href="/tos" target="_blank">利用規約</a>に同意する
          </label>
        </div>
        <Button
          variant="primary"
          id="register-button"
          onClick={this.register.bind(this)}
          disabled={!this.state.checked || !this.state.userId || this.props.disabled}
        >
          登録する
        </Button>
      </form>
    )
  }

  register() {
    this.props.registerUser(this.props.api, this.state.userId)
  }
}

export default UserRegister
