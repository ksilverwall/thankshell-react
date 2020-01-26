import React from 'react'
import { Alert } from 'react-bootstrap'
import { UserLoadingState } from './actions'
import SendTokenButton from './SendTokenButton'
import TransactionHistory from './TransactionHistory'
import { GroupInfo } from './thankshell'
import './GroupIndex.css'

const GroupIndex = (props) => {
  // FIXME: Move to private router
  if (props.userLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.user.error}</Alert>)
  }

  if (props.userLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.userLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadUser(props.api)
    return (<h1>Loading...</h1>)
  }

  // FIXME: Move to group router
  if (props.groupLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.user.error}</Alert>)
  }

  if (props.groupLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.groupLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadGroup(props.api, props.match.params.id)
    return (<h1>Loading...</h1>)
  }

  const group = new GroupInfo(props.group)

  if (props.user) {
    if (props.user.status === 'UNREGISTERED') {
      props.history.push('/user/register')
      return (<p>redirecting...</p>)
    }
  }

  return (
    <article>
      {
        group.getMembers().includes(props.user.user_id) ?
          (<GroupIndexMemberPage {...props} />) :
          (<GroupIndexVisitorPage />)
      }
    </article>
  )
}

const GroupIndexVisitorPage = () => (
  <article className="container-fluid">
    <p id="visitor-text">このグループに参加していません</p>
    <p className="warning-text">
      6/1以前にSLA入会のユーザ様でこの画面が表示された場合は
      <a href="https://forms.gle/vrXj9XF95LDGBMEJ6" target="_blank" rel="noopener noreferrer">
        問い合わせフォーム
      </a>
      から連絡をお願いします。
    </p>
  </article>
)

class GroupIndexMemberPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      holding: null,
      transactionHistory: [],
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.reloadTransactions()
  }

  render() {
    return (
      <article className="container-fluid">
        {
          this.state.errorMessage ? (
            <Alert variant="danger">
              {this.state.errorMessage}
            </Alert>
          ) : null
        }
        <section>
          <a className="row" href="https://sketch-life-academy.com/selan-help/">ヘルプ</a>
          <button
            className="row btn my-2 my-sm-0"
            onClick={() => {this.props.history.push('/groups/sla/admin')}}
          >
            管理ページへ
          </button>
        </section>

        <section>
          <img src="/images/logo.png" className="row col-6 col-sm-2 offset-3 offset-sm-5 img-fluid" alt="selan-logo" />
        </section>

        <section>
          <h1 className="text-right">残高<u>{this.state.holding ? this.state.holding: '---'} Selan</u></h1>
        </section>

        <section>
          <p className="warning-text">送金後の取り消しはできませんのでご注意ください</p>
          <SendTokenButton {...this.props} callback={this.reloadTransactions.bind(this)} />
        </section>

        <TransactionHistory
          transactionHistory={this.state.transactionHistory}
          api={this.props.api}
          user={this.props.user}
        />
      </article>
    )
  }

  //-------------------------------------------------------------------
  // async load

  async reloadTransactions() {
    try {
      this.setState({
        holding: await this.props.api.getHolding('selan', this.props.user.user_id),
        transactionHistory: await this.props.api.loadTransactions('selan', this.props.user.user_id),
      })
    } catch(e) {
      this.setState({errorMessage: 'ERROR: ' + e.message})
    }
  }
}

export default GroupIndex
