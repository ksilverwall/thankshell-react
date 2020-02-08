import React from 'react'
import { Alert } from 'react-bootstrap'
import { UserLoadingState } from '../../../actions'
import SendTokenButton from './SendTokenButton.js'
import TransactionHistory from './TransactionHistory.js'
import './GroupIndex.css'


const GroupIndex = (props) => {
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
