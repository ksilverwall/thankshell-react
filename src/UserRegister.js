import React from 'react'
import { GetCognitoAuth } from './auth'
import { ThankshellApi } from './thankshell.js'
import { Button } from 'react-bootstrap';

class UserRegister extends React.Component {
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
      const session = await this.getSession(auth)
      if (!session) {
        this.setState({articleComponent: (<h2>セッションの読み込みに失敗しました。再読込してください</h2>)})
        return
      }

      const api = new ThankshellApi(session, 'dev');

      let userInfo = await api.getUser();
      if (userInfo.status !== 'UNREGISTERED') {
        this.props.history.push('/groups/sla')
        return
      }

      this.setState({articleComponent: (<UserRegisterPage api={api} history={this.props.history}/>)})
    } catch(e) {
      this.setState({articleComponent: (<p>読み込みエラー</p>)})
      console.log(e.message)
    }
  }

  getSession(auth) {
    return new Promise((resolve, reject) => {
        auth.userhandler = {
            onSuccess: resolve,
            onFailure: reject,
        };

        auth.getSession();
    });
  }
}

class UserRegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      userId: null,
      checked: false,
    };
  }

  render() {
    return (
      <article className="container-fluid">
        <p className="alert alert-danger" role="alert">{this.state.message}</p>
        <form className="form-horizontal" id="register" onsubmit="register(); return false">
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
            <label className="form-check-label" for="agree-check"><a href="/tos" target="_blank">利用規約</a>に同意する</label>
          </div>
          <Button
            variant="primary"
            id="register-button"
            onClick={this.register.bind(this)}
            disabled={!this.state.checked || !this.state.userId}>登録する</Button>
        </form>
      </article>
    )
  }

  async register() {
    try {
      const data = await this.props.api.createUser(this.state.userId);
      const responseBody = data.body;
      switch (data.status) {
        case 200:
          break;
        case 403:
          switch (responseBody.code) {
            case 'AUTHINFO_ALREADY_REGISTERD':
              break
            default:
              throw new Error(responseBody.message)
          }
          break
        default:
          throw new Error(responseBody.message)
      }

      this.props.history.push('/groups/sla')
    } catch(e) {
      this.setState({message: e.message})
    }
  }
}

export default UserRegister
