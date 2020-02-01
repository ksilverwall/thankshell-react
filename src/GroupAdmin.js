import React from 'react';
import Modal from 'react-modal'
import { Button, Table } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import { GroupInfo } from './thankshell.js'
import SendTokenButton from './SendTokenButton'
import PublishTokenButton from './PublishTokenButton'
import './GroupIndex.css'

Modal.setAppElement('#root')

const GroupAdmin = (props) => {
  const group = new GroupInfo(props.group)

  if (!group.getAdmins().includes(props.user.user_id)) {
    return (<h1>アクセス権限がありません</h1>)
  }

  return (<GroupAdminPage {...props} group={group}/>)
}

class GroupAdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      holdings: {},
      totalPublished: '---',
      bankHolding: '---',
      userHoldings: '---',
      transactionHistory: [],
      modalComponent: null,
      groupInfo: props.group,
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

        <section>
          <PublishTokenButton onComplete={this.reloadTransactions.bind(this)} api={this.props.api} />
        </section>

        <section>
          <p className="text-center text-danger">送金後の取り消しはできませんのでご注意ください</p>
          <SendTokenButton
            {...this.props}
            callback={this.reloadTransactions.bind(this)}
            adminMode={true}
          />
        </section>

        <HoldingStatusSection holdings={this.state.holdings} group={this.state.groupInfo} api={this.props.api}/>
        <TransactionSection
          transactionHistory={this.state.transactionHistory}
          api={this.props.api}
          userInfo={this.props.user}
        />

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
    const names = this.props.group.getMembers()
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
