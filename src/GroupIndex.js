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

  // FIXME: Move to transaction history
  if (props.tokenLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.token.error}</Alert>)
  }

  if (props.tokenLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.tokenLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadTransactions(props.api, 'selan', props.user.user_id)
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

const GroupIndexMemberPage = (props) => {
  return (
    <article className="container-fluid">
      <section>
        <a className="row" href="https://sketch-life-academy.com/selan-help/">ヘルプ</a>
        <button
          className="row btn my-2 my-sm-0"
          onClick={() => {props.history.push('/groups/sla/admin')}}
        >
          管理ページへ
        </button>
      </section>

      <section>
        <img src="/images/logo.png" className="row col-6 col-sm-2 offset-3 offset-sm-5 img-fluid" alt="selan-logo" />
      </section>

      <section>
        <h1 className="text-right">残高<u>{props.token.holding ? props.token.holding: '---'} Selan</u></h1>
      </section>

      <section>
        <p className="warning-text">送金後の取り消しはできませんのでご注意ください</p>
        <SendTokenButton
          {...props}
          callback={() => {props.setTokenLoadingState(UserLoadingState.NOT_LOADED)}}
        />
      </section>

      <TransactionHistory
        transactionHistory={props.token.transactions}
        api={props.api}
        user={props.user}
      />
    </article>
  )
}

export default GroupIndex
