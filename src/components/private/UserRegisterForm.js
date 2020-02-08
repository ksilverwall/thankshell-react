import React from 'react'
import { Button } from 'react-bootstrap'
import { Alert } from 'react-bootstrap'

export default class UserRegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      checked: false,
    };
  }

  render() {
    const errorMessage = this.props.userRegisterError
    return (
      <form className="form-horizontal">
        {
          errorMessage
            ? (
              <Alert variant="danger">
                {errorMessage}
              </Alert>
            )
            : null
        }
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
