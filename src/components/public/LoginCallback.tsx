import React from 'react';
import { GetCognitoAuth } from '../../libs/auth'

class LoginCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "ログイン中...",
    };
  }

  componentDidMount() {
    const responseToken = this.props.location.search
    try {
      const auth = GetCognitoAuth()
      auth.userhandler = {
        onSuccess: this.onLoginSuccess.bind(this),
        onFailure: this.onLoginFailure.bind(this),
      }
      auth.parseCognitoWebResponse(responseToken);
    } catch(err) {
      this.setState({
        'message': `ERROR on parse ${responseToken}: ${err}`
      })
    }
  }

  render() {
    return (
      <h1>{this.state.message}</h1>
    )
  }

  onLoginSuccess(result) {
    this.props.history.push(localStorage.getItem('callbackPath'))
  }

  onLoginFailure(err) {
    this.setState({
      'message': `ERROR: ${err}`
    })
  }
}

export default LoginCallback
