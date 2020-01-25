import React from 'react';
import Modal from 'react-modal'
import { Button, Table } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import { GetCognitoAuth } from './auth'
import { GetThankshellApi, GroupInfo } from './thankshell.js'
import './GroupIndex.css'

Modal.setAppElement('#root')

class GroupAdmin extends React.Component {
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
      const api = GetThankshellApi(GetCognitoAuth())

      let userInfo = await api.getUser();
      if (userInfo.status === 'UNREGISTERED') {
        this.props.history.push('/user/register')
        return
      }

      this.setState({articleComponent: await this.renderAdminPage(api, userInfo)})
    } catch(e) {
      this.setState({articleComponent: (<p>読み込みエラー: {e.message}</p>)})
      console.log(e.message)
    }
  }

  async renderAdminPage(api, userInfo) {
    let groupInfo = new GroupInfo(await api.getGroup('sla'));
    if (groupInfo.getMembers().includes(userInfo.user_id)) {
      return (<GroupAdminPage api={api} groupInfo={groupInfo} userInfo={userInfo} history={this.props.history}/>)
    } else {
      return (<AccessDeniedPage />)
    }
  }
}

const AccessDeniedPage = () => (
  <h1>アクセス権限がありません</h1>
)

class GroupAdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      holdings: {},
      totalPublished: '---',
      bankHolding: '---',
      userHoldings: '---',
      transactionHistory: [],
      modalComponent: null,
      groupInfo: props.groupInfo,
    };
  }

  componentDidMount() {
    this.reloadTransactions()
  }

  render() {
    return (
      <article className="container-fluid">
        <h1>管理フォーム</h1>

        <p className="text-center text-danger">{this.state.errorMessage}</p>
        <section>
          <h4 className="text-right">総発行量 <u>{this.state.totalPublished} Selan</u></h4>
          <h4 className="text-right">銀行保有量 <u>{this.state.bankHolding} Selan</u></h4>
          <h4 className="text-right">流通量 <u>{this.state.userHoldings} Selan</u></h4>
        </section>

        <Button variant="primary" onClick={this.openPublishModal.bind(this)}>新規発行</Button>

        <section>
          <p className="text-center text-danger">送金後の取り消しはできませんのでご注意ください</p>
          <button className="btn btn-primary" onClick={this.openSendTokenModal.bind(this)}>送る</button>
        </section>

        <HoldingStatusSection holdings={this.state.holdings} groupInfo={this.state.groupInfo} api={this.props.api}/>
        <TransactionSection
          transactionHistory={this.state.transactionHistory}
          api={this.props.api}
          userInfo={this.props.userInfo}
        />

        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeSendTokenModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.closeSendTokenModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.state.modalComponent}
        </Modal>
      </article>
    )
  }

  async reloadTransactions() {
    try {
      const holdings = await this.props.api.getHoldings('selan')
      const totalPublished = Object.values(holdings).reduce((prev, item) => prev + item, 0)
      this.setState({
        holdings: holdings,
        totalPublished: totalPublished,
        bankHolding: holdings['sla_bank'],
        userHoldings: totalPublished - holdings['sla_bank'],
        transactionHistory: await this.props.api.loadAllTransactions('selan'),
      })
    } catch(e) {
      this.setState({errorMessage: 'ERROR: ' + e.message})
    }
  }

  openPublishModal() {
    this.setState({
      modalComponent: (
        <PublishTokenForm
          api={this.props.api}
          onComplete={this.onSendTokenCompleted.bind(this)}
        />
      ) 
    })
    this.setState({modalIsOpen: true})
  }

  openSendTokenModal() {
    this.setState({
      modalComponent: (
        <SendTokenForm
          from={this.props.userInfo.user_id}
          api={this.props.api}
          onComplete={this.onSendTokenCompleted.bind(this)}
        />
      ) 
    })
    this.setState({modalIsOpen: true})
  }

  closeSendTokenModal() {
    this.setState({modalIsOpen: false})
  }

  onSendTokenCompleted() {
    this.closeSendTokenModal()
    this.reloadTransactions()
  }
}

class PublishTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: null,
      amount: 10000,
    };
  }

  render() {
    return (
      <React.Fragment>
	    <h4>Selanを増刷する</h4>
        <form>
          <p className="warning-text">{this.state.message}</p>
          <div className="form-group">
            <input
              className="form-control text-right"
              type="number" name="amount" min="1000"
              value={this.state.amount}
              onChange={e=>this.setState({amount: e.target.value})}/>
            <Button
              variant="primary"
              onClick={this.publish.bind(this)}
              disabled={this.state.isSending}>新規発行</Button>
          </div>
        </form>
        <br/>
        <p className="text-center text-danger">削除未実装のためご注意ください</p>
      </React.Fragment>
    )
  }

  async publish() {
    this.setState({
      isSenging: true,
      message: '発行中...',
    })

    try {
      await this.props.api.publish('selan', 'sla_bank', this.state.amount);
      this.props.onComplete()
    } catch(e) {
      this.setState({
        isSenging: false,
        message: 'ERROR: ' + e.message,
      })
    }
  }
}


class SendTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: null,
      sendFrom: 'sla_bank',
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
            <div className="from-block" colspan="2">
              <input className="form-condivol" type="text" name="to" placeholder="FROM" value={this.state.sendFrom} onChange={e=>this.setState({sendFrom: e.target.value})}/>
            </div>
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

class DeleteMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    }
  }
  render() {
    return (
      <React.Fragment>
        <p>{this.props.name} をグループから削除します</p>
        <Button variant="danger" onClick={()=>{this.deleteMember(this.props.name)}}>削除</Button>
        <p className="warning-text">{this.state.message}</p>
      </React.Fragment>
    )
  }

  async deleteMember(name) {
    try {
      await this.props.api.deleteUserFromGroup(this.props.groupId, name)
      this.props.onComplete()
    } catch(error) {
      this.setState({message: error.message})
    }
  }
}

class HoldingStatusSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenning: false,
      modalContents: null,
    };
  }

  render() {
    const names = this.props.groupInfo.getMembers()
    const data = {
      columns: [
        {
          label: 'ユーザ',
          field: 'user',
        },
        {
          label: '保有量',
          field: 'amount',
          sort: 'asc',
        },
        {
          label: '操作',
          field: 'deleteButton',
        },
      ],
      rows: names.map(name => {
        return {
          user: name,
          amount: this.props.holdings[name] ? this.props.holdings[name] : 0,
          deleteButton: (
            <Button variant="danger" onClick={() => {
              this.setState({
                modalContents: this.getModalContents(name),
                isOpenning: true,
              })
            }}>
              退会
            </Button>
          )
        }
      }),
    }
 
    return (
      <section className="card mb-3">
        <div className="card-header">
          <h4>保有状況</h4>
        </div>
        <div className="card-body">
          <MDBDataTable
            striped
            bordered
            hover
            data={data}
          />
        </div>
        <Modal isOpen={this.state.isOpenning} onRequestClose={this.handleCloseModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.handleCloseModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.state.modalContents}
        </Modal>
      </section>
    )
  }

  handleCloseModal() {
    this.setState({
      isOpenning: false,
    })
  }

  getModalContents(name) {
    return (
      <DeleteMemberForm
        api={this.props.api}
        groupId={this.props.groupInfo.groupId}
        name={name}
        onComplete={this.handleCloseModal.bind(this)} />
    )
  }
}

class TransactionSection extends React.Component {
  render() {
    return (
      <section className="transaction-log">
        <h3>取引履歴</h3>
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
                <tr key={record.timestamp}>
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
      </section>
    )
  }

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
}

export default GroupAdmin
