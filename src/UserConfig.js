import React from 'react'
import { GetCognitoAuth } from './auth'
import { GetThankshellApi } from './thankshell.js'
import { Button, Alert } from 'react-bootstrap';

class UserConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleComponent: (<h1>読込中・・・</h1>)
    };
  }

  componentDidMount() {
    this.loadComponents()
  }

  render() {
    return (
      <article>{this.state.articleComponent}</article>
    )
  }

  async loadComponents() {
    try{
      const auth = GetCognitoAuth()
      const api = GetThankshellApi(auth)

      let userInfo = await api.getUser();
      if (userInfo.status === 'UNREGISTERED') {
        this.props.history.push('/groups/sla')
        return
      }

      this.setState({articleComponent: (<UserConfigPage auth={auth} userId={userInfo.user_id}/>)})
    } catch(e) {
      this.setState({articleComponent: (<p>読み込みエラー: {e.message}</p>)})
      console.log(e.message)
    }
  }
}

class UserConfigPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/groups/sla">ホーム </a>
            <a className="nav-item nav-link" href="/user/config">設定</a>
          </div>
        </nav>

        <article className="container-fluid">
          <Alert variant="denger"></Alert>
          <h4>ID: {this.props.userId}</h4>
          <Button variant="primary" onClick={this.logout.bind(this)}>ログアウト</Button>
        </article>
      </React.Fragment>
    )
  }

  async logout() {
    this.props.auth.signOut()
  } 
}

export default UserConfig
