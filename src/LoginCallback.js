import React from 'react';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
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
      auth.parseCognitoWebResponse(this.props.location.search);

      this.props.history.push('/groups/sla')
    } catch(e) {
      this.setState({'message': 'ERROR: ' + e.message})
    }
  }

  render() {
    return (
      <h1>{this.state.message}</h1>
    )
  }
}

export default LoginCallback
