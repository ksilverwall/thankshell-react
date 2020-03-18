import React from 'react';
import Modal from 'react-modal'
import { Button, Table, Form } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import ControlMemberTokenButton from './ControlMemberTokenButton.js'
import PublishTokenButton from './PublishTokenButton.js'
import { GroupInfo } from '../../../libs/thankshell.js'
import './GroupIndex.css'
import { UserLoadingState } from '../../../actions/index.js';

Modal.setAppElement('#root')

const GroupAdmin = (props) => {
  const group = new GroupInfo(props.group)

  if (!group.getAdmins().includes(props.user.user_id)) {
    return (<h1>アクセス権限がありません</h1>)
  }

  if (props.adminTokenLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadAdminTransactions('selan')
  }

  return (<GroupAdminPage {...props} group={group}/>)
}

const GroupAdminPage = (props) => {
  const holdings = props.adminToken ? props.adminToken.holdings : {}
  const transactionHistory = props.adminToken ? props.adminToken.allTransactions : []
  return (
    <article className="container-fluid">
      <h1>管理フォーム</h1>

      <Holdings
        holdings={holdings}
        api={props.api}
        reloadAdminTransactions={props.reloadAdminTransactions}
      />

      <section>
        <p className="text-center text-danger">送金後の取り消しはできませんのでご注意ください</p>
        <ControlMemberTokenButton
          {...props}
          callback={props.reloadAdminTransactions.bind(this)}
          adminMode={true}
        />
      </section>

      <HoldingStatusSection holdings={holdings} group={props.group} api={props.api}/>
      <TransactionSection
        transactionHistory={transactionHistory}
        api={props.api}
        userInfo={props.user}
      />

    </article>
  )
}

const Holdings = ({holdings, api, reloadAdminTransactions}) => {
  const totalPublished = Object.values(holdings).reduce((prev, item) => prev + item, 0)
  return (
    <section className="card mb-3">
      <div className="card-header">
        <h4>発行管理</h4>
      </div>
      <div className="card-body">
        <PublishTokenButton onComplete={reloadAdminTransactions.bind(this)} api={api} />
        <h4 className="text-right">総発行量 <u>{totalPublished} Selan</u></h4>
        <h4 className="text-right">銀行保有量 <u>{holdings['sla_bank']} Selan</u></h4>
        <h4 className="text-right">流通量 <u>{totalPublished - holdings['sla_bank']} Selan</u></h4>
      </div>
    </section>
  )
}

class AddMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      userId: '',
    }
  }

  render() {
    return (
      <React.Fragment>
        <Form>
          <Form.Control
            type="text"
            placeholder="User id"
            value={this.state.userId}
            onChange={e=>this.setState({userId: e.target.value})}
          />
        </Form>
        <Button onClick={()=>{this.addMember(this.state.userId)}}>追加</Button>
        <p className="warning-text">{this.state.message}</p>
      </React.Fragment>
    )
  }

  async addMember(name) {
    try {
      await this.props.api.addUserToGroup(this.props.group.groupId, name)
      this.props.onComplete()
    } catch(error) {
      this.setState({message: error.message})
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
        <p>{this.props.userId} をグループから削除します</p>
        <Button variant="danger" onClick={()=>{this.deleteMember(this.props.userId)}}>削除</Button>
        <p className="warning-text">{this.state.message}</p>
      </React.Fragment>
    )
  }

  async deleteMember(name) {
    try {
      await this.props.api.deleteUserFromGroup(this.props.group.groupId, name)
      this.props.onComplete()
    } catch(error) {
      this.setState({message: error.message})
    }
  }
}

class UnregisterUserButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenning: false,
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.state.isOpenning} onRequestClose={this.handleCloseModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.handleCloseModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <DeleteMemberForm
            api={this.props.api}
            group={this.props.group}
            userId={this.props.name}
            onComplete={this.handleCloseModal.bind(this)}
          />
        </Modal>
        <Button variant="danger" onClick={() => {
          this.setState({isOpenning: true})
        }}>
          退会
        </Button>
      </React.Fragment>
    )
  }

  handleCloseModal() {
    this.setState({isOpenning: false})
  }
}

class RegisterUserButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenning: false,
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.state.isOpenning} onRequestClose={this.handleCloseModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.handleCloseModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <AddMemberForm
            api={this.props.api}
            group={this.props.group}
            userId={this.props.name}
            onComplete={this.handleCloseModal.bind(this)}
          />
        </Modal>
        <Button onClick={() => {
          this.setState({isOpenning: true})
        }}>
          追加
        </Button>
      </React.Fragment>
    )
  }

  handleCloseModal() {
    this.setState({isOpenning: false})
  }
}

class HoldingStatusSection extends React.Component {
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
            <UnregisterUserButton
              group={this.props.group}
              api={this.props.api}
              name={name}
            />
          )
        }
      }),
    }
 
    return (
      <section className="card mb-3">
        <div className="card-header">
          <h4>ユーザリスト</h4>
        </div>
        <div className="card-body">
          <RegisterUserButton
            api={this.props.api}
            group={this.props.group}
          />
          <MDBDataTable
            striped
            bordered
            hover
            data={data}
          />
        </div>
      </section>
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
