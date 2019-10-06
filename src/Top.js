import React from 'react';
import './Top.css';
import { Button } from 'react-bootstrap';
import { GetCognitoAuth, AuthConfig } from './auth'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

class Top extends React.Component {
  handleSignIn() {
    const auth = new CognitoAuth(AuthConfig)
    auth.userhandler = {
      onSuccess: function(result) {
        this.props.history.push('/groups/sla')
      },
      onFailure: function(err) {
        console.log(err);
        auth.launchUri(auth.getFQDNSignIn())
      }
    }
    auth.useCodeGrantFlow();
    auth.getSession()
  }

  render() {
    console.log(process.env.REACT_APP_COGNITO_AUTH_CLIENT_ID)
    return (
      <article>
        <section className="hero">
          <div>
            <h1>感謝の気持ちを伝え合おう</h1>
            <Button variant="primary" onClick={this.handleSignIn.bind(this)}>Sign In</Button>
          </div>
        </section>
      </article>
    )
  }
}

export default Top;
