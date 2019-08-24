import React from 'react';
import { Route } from 'react-router-dom'
import { GetCognitoAuth } from './auth'

class PrivateRoute extends React.Component {
  render(){
    const auth = GetCognitoAuth()
    if (auth.isUserSignedIn()) {
      return (<Route path={this.props.path} component={this.props.component} />)
    } else {
      return (
        <div>
          <h2>ログインされていません</h2>
          <a href="/">トップへ</a>
        </div>
      )
    }
  }
}

export default PrivateRoute
