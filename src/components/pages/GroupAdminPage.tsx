import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap'
import Modal from 'react-modal'
import { Button, Table, Form } from 'react-bootstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { MDBDataTable } from 'mdbreact';

import ControlMemberTokenButton from '../private/groups/ControlMemberTokenButton'
import PublishTokenButton from '../private/groups/PublishTokenButton'
import './GroupIndex.css'

import UseSession from 'components/app/UseSession';
import LoadEnv from 'components/app/LoadEnv';
import LoadGroup from 'components/app/LoadGroup';
import LoadUser from 'components/app/LoadUser';
import RevisionUpdateMessage from 'components/RevisionUpdateMessage';

import NotFoundPage from 'components/pages/NotFoundPage'
import FooterPanel from 'components/organisms/FooterPanel';

import UserRepository from 'libs/UserRepository';
import GroupRepository from 'libs/GroupRepository';
import { RestApi } from 'libs/thankshell';

import { useLocation, useMatch } from 'react-router-dom';
import ErrorMessage from 'components/ErrorMessage';


Modal.setAppElement('#root')


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
      await this.props.api.addUserToGroup(this.props.groupId, name)
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
      await this.props.api.deleteUserFromGroup(this.props.groupId, name)
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
            groupId={this.props.group.groupId}
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
            groupId={this.props.group.groupId}
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

const HoldingStatusSection = ({api, group, holdings}) => {
  const names = Object.keys(group.members)
  const data = {
    columns: [
      {label: 'ユーザ', field: 'user'},
      {label: '保有量', field: 'amount', sort: 'asc'},
      {label: '状態', field: 'state'},
      {label: 'コピー', field: 'copy'},
      {label: '操作', field: 'deleteButton'},
    ],
    rows: names.map(name => {
      const member = group.members[name]
      return {
        user: `${member.displayName}(${name})`,
        amount: holdings[name] ? holdings[name] : 0,
        state: member.state,
        copy: member.linkParams ? (
          <CopyToClipboard text={`${window.location.origin}/groups/sla/entry?m=${member.linkParams.m}&hash=${member.linkParams.hash}`}>
            <Button>Copy Link</Button>
          </CopyToClipboard>
        ) : null,
        deleteButton: (
          <UnregisterUserButton
            group={group}
            api={api}
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
          api={api}
          group={group}
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

const LoadingState = {
  INIT: 'INIT',
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
}

const getTimeString = timestamp => {
  let d = new Date(timestamp);
  let year  = d.getFullYear();
  let month = d.getMonth() + 1;
  let day   = d.getDate();
  let hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
  let min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
  let sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();

  return ( year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec );
}

const getDisplayName = (members, name) => {
  return Object.keys(members).includes(name) ? members[name].displayName : name
}

const TransactionSection = ({api, groupId, members}) => {
  const [transactions, setTransactions] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [loadingState, setLoadingState] = useState(LoadingState.INIT)

  const loadTransactions = async() => {
    if (loadingState !== LoadingState.INIT) { return }
    setLoadingState(LoadingState.LOADING)

    try {
      setTransactions(await api.loadAllTransactions(groupId))
    } catch(err) {
      setErrorMessage(err.message)
    } finally {
      setLoadingState(LoadingState.COMPLETE)
    }
  }

  if (!transactions) {
    loadTransactions()
  }

  return (
    <section className="transaction-log">
      <h3>取引履歴</h3>
      {
        errorMessage ? (<p>{errorMessage}</p>)
        : (!transactions) ? (<p>Loading</p>)
        : (
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
                transactions.sort((a, b) => { return b.timestamp - a.timestamp; }).map((record)=> (
                  <tr key={record.timestamp}>
                    <td>{getTimeString(record.timestamp)}</td>
                    <td>{getDisplayName(members, record.from_account)}</td>
                    <td>{getDisplayName(members, record.to_account)}</td>
                    <td className="text-right">{record.amount.toLocaleString()}</td>
                    <td className="text-left">{record.comment ? record.comment : ''}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        )
      }
    </section>
  )
}

const GroupAdminPageLegacy = ({api, reloadAdminTransactions, group}) => {
  const [holdings, setHoldings] = useState()
  const [loadingState, setLoadingState] = useState(LoadingState.INIT)
  const [errorMessage, setErrorMessage] = useState('')
  const loadHoldings = async() => {
    if (loadingState !== LoadingState.INIT) { return }
    setLoadingState(LoadingState.LOADING)

    try {
      setHoldings(await api.getHoldings(group.groupId))
    } catch(err) {
      setErrorMessage(err.message)
    } finally {
      setLoadingState(LoadingState.COMPLETE)
    }
  }

  if (!holdings) { loadHoldings() }

  return (
    <article className="container-fluid">
      <ErrorMessage message={errorMessage}/>
      <h1>管理フォーム</h1>

      <Holdings
        holdings={holdings ? holdings : {}}
        api={api}
        reloadAdminTransactions={reloadAdminTransactions}
      />

      <section>
        <p className="text-center text-danger">送金後の取り消しはできませんのでご注意ください</p>
        <ControlMemberTokenButton
          api={api}
          callback={reloadAdminTransactions.bind(this)}
        />
      </section>

      <HoldingStatusSection holdings={holdings ? holdings : {}} group={group} api={api}/>
      <TransactionSection
        api={api}
        groupId={group.groupId}
        members={group.members}
      />

    </article>
  )
}

const GroupAdmin = ({api, group}: any) => {
  const [loadingState, setLoadingState] = useState(LoadingState.INIT);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<{updatedAt: number}|null>();

  const reloadAdminTransactions = () => {
    setToken(null);
  };

  const loadAdminTransactions = useCallback(async() => {
    if (loadingState !== LoadingState.INIT) { return }
    setLoadingState(LoadingState.LOADING)

    try {
      setToken({
        updatedAt: new Date().getTime(),
      })
    } catch(err) {
      setErrorMessage(err.message)
    } finally {
      setLoadingState(LoadingState.COMPLETE)
    }
  }, [loadingState]);

  useEffect(()=>{
    if (!token) {
      loadAdminTransactions();
    }
  }, [token, loadAdminTransactions]);

  return (
    <>
      <ErrorMessage message={errorMessage}/>
      <GroupAdminPageLegacy
        api={api}
        reloadAdminTransactions={reloadAdminTransactions}
        group={group}
      />
    </>
  )
}

const GroupAdminPage = () => {
  const match = useMatch('/groups/:groupId');
  const groupId = match ? match.params.groupId : null;
  const location = useLocation();

  if (!groupId) {
    return null;
  }

  return (
    <LoadEnv render={(env)=>(
      <>
        <RevisionUpdateMessage localVersion={env.version || ''} />
        <UseSession
          callbackPath={location.pathname + location.search}
          render={({session})=> {
            if (errorMessage) {
              return (<Alert>{errorMessage}</Alert>)
            }

            const api = new RestApi(session, env.apiUrl);

            return (
              <LoadUser
                repository={new UserRepository(groupId, api)}
                onError={(msg)=>setErrorMessage(`User Load Error: ${msg}`)}
                render={()=>(
                  <LoadGroup
                    groupRepository={new GroupRepository(groupId, api)}
                    render={({group})=>{
                      if (!group) {
                        return <h1>Loading...</h1>;
                      }

                      return (
                        <main>
                          {
                            ['admin', 'owner'].includes(group.permission) ? (
                              <GroupAdmin api={api} group={group}/>
                            ) : <NotFoundPage/>
                          }
                          <footer>
                            <FooterPanel/>
                          </footer>
                        </main>
                      );
                    }
                  }/>
                )}
              />
            );
          }}
        />
      </>
    )}/>
  );
}

export default GroupAdminPage;
