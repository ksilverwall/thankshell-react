import React from 'react';
import { GetCognitoAuth } from './auth'

class LoginCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "ログイン中...",
    };
  }

  componentDidMount() {
    try {
      let auth = GetCognitoAuth()
      auth.userhandler = {
        onSuccess: this.onLoginSuccess.bind(this),
        onFailure: this.onLoginFailure.bind(this),
      }
      auth.parseCognitoWebResponse(this.props.location.search);
    } catch(err) {
      this.setState({'message': 'ERROR: ' + err.message})
    }
  }

  render() {
    return (
      <h1>{this.state.message}</h1>
    )
  }

  onLoginSuccess(result) {
    this.props.history.push('/groups/sla')
  }

  onLoginFailure(err) {
    this.setState({'message': 'ERROR: ' + err.message})
  }
}

export default LoginCallback
