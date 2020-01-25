import React from 'react'
import { Button, Table, Alert } from 'react-bootstrap'
import EventListener from 'react-event-listener'
import Modal from 'react-modal'
import { UserLoadingState } from './actions'
import { GroupInfo } from './thankshell'
import './GroupIndex.css'

Modal.setAppElement('#root')

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

        <TransactionSection
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

class SendTokenButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
    }
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.openModal.bind(this)}>
          送る
        </Button>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.closeModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <SendTokenForm
            from={this.props.user.user_id}
            api={this.props.api}
            onComplete={this.onCompleted.bind(this)}
          />
        </Modal>
      </React.Fragment>
    )
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  onCompleted() {
    this.closeModal()
    this.props.callback()
  }
}

class TransactionSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isListMode: this.getListMode()
    }
  }

  getListMode() {
    return window.innerWidth < 600
  }

  handleResize() {
    this.setState({isListMode: this.getListMode()})
  }

  render() {
    return (
      <section className="transaction-log">
        <h3>取引履歴</h3>
        <EventListener target="window" onResize={this.handleResize.bind(this)} />
        {
          this.state.isListMode ? (
            <HistoryList transactionHistory={this.props.transactionHistory} userId={this.props.user.user_id}/>
          ) : (
            <HistoryTable transactionHistory={this.props.transactionHistory} userId={this.props.user.user_id}/>
          )
        }
      </section>
    )
  }
}

class HistoryList extends React.Component {
  getTimeString(timestamp) {
    let d = new Date(timestamp);
    let year  = d.getFullYear();
    let month = d.getMonth() + 1;
    let day   = d.getDate();
    let hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    let min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    let sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();

    return ( year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec );
  }

  render() {
    return (
      <dl className='transaction-history-list'>
        {
          this.props.transactionHistory.sort((a, b) => { return b.timestamp - a.timestamp; }).map((record)=> (
            <dt key={record.timestamp}>
              <table>
                <tbody>
                  <tr>
                    <td colSpan="2" className='transaction-datetime'>{this.getTimeString(record.timestamp)}</td>
                  </tr>
                  <tr>
                    <td className='transaction-partner'>{(record.to_account === this.props.userId) ? record.from_account : record.to_account}</td>
                    {
                      (record.to_account === this.props.userId) ? (
                        <td className='transaction-amount-in'>+{record.amount.toLocaleString()}</td>
                      ) : (
                        <td className='transaction-amount-out'>-{record.amount.toLocaleString()}</td>
                      )
                    }
                  </tr>
                  {
                    (record.comment) ?
                      (
                        <tr>
                          <td colSpan="2" className="transaction-message">{record.comment}</td>
                        </tr>
                      )
                    : ""
                  }
                </tbody>
              </table>
            </dt>
          ))
        }
      </dl>
    )
  }
}

class HistoryTable extends React.Component {
  getTimeString(timestamp) {
    let d = new Date(timestamp);
    let year  = d.getFullYear();
    let month = d.getMonth() + 1;
    let day   = d.getDate();
    let hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    let min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    let sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();

    return ( year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec );
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th scope="col">取引日時</th>
            <th scope="col">FROM</th>
            <th scope="col">TO</th>
            <th scope="col" className="text-right">金額(selan)</th>
            <th scope="col" className="text-left">コメント</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.transactionHistory.sort((a, b) => { return b.timestamp - a.timestamp; }).map((record)=> (
              <tr>
                <td>{this.getTimeString(record.timestamp)}</td>
                <td>{record.from_account}</td>
                <td>{record.to_account}</td>
                <td className="text-right">{record.amount.toLocaleString()}</td>
                <td className="text-left">{record.comment ? record.comment : ''}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

class SendTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: null,
      sendFrom: props.from,
      sendTo: null,
      sendAmount: 1000,
      sendComment: null,
    };
  }

  async sendToken() {
    this.setState({
      isSenging: true,
      message: '送金中...',
    })

    try {
      const sendInfo = {
        from:    this.state.sendFrom,
        to:      this.state.sendTo,
        amount:  this.state.sendAmount,
        comment: this.state.sendComment,
      }

      await this.props.api.createTransaction('selan', sendInfo);
      this.props.onComplete()
    } catch(e) {
      this.setState({
        isSenging: false,
        message: 'ERROR: ' + e.message,
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <h4>Selanを送る</h4>
        <form className="send-token-modal-form">
          <p className="warning-text">{this.state.message}</p>
          <div className="send-map">
            <div className="from-block" colspan="2">{this.state.sendFrom}</div>
            <div className="arrow">
              ↓
              <input className="amount form-condivol" type="number" min="1" name="amount" value={this.state.sendAmount} onChange={e=>this.setState({sendAmount: e.target.value})}/>
            </div>
            <div className="to-block">
              <input className="form-condivol" type="text" name="to" placeholder="TO" value={this.state.sendTo} onChange={e=>this.setState({sendTo: e.target.value})}/>
            </div>
          </div>

          <div>
            <label>コメント</label>
            <input className="form-control" type="text" name="comment" value={this.state.sendComment} onChange={e=>this.setState({sendComment: e.target.value})}/>
          </div>

          <div style={{"text-align": "center"}}>
            <Button variant="primary" onClick={this.sendToken.bind(this)} disabled={this.state.isSending}>送る</Button>
          </div>
          <p className="warning-text">送金後の取り消しはできませんのでご注意ください</p>
        </form>
      </React.Fragment>
    )
  }
}

export default GroupIndex
