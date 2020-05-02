import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'
import { UserLoadingState } from '../../../actions'
import SendTokenButton from './SendTokenButton.js'
import TransactionHistory from './TransactionHistory.js'
import './GroupIndex.css'


const GroupIndex = ({group, api, token, tokenLoadingState, setTokenLoadingState, loadTransactions}) => {
  // FIXME: Move to transaction history
  if (tokenLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {token.error}</Alert>)
  }

  if (tokenLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (tokenLoadingState === UserLoadingState.NOT_LOADED) {
    loadTransactions(group.groupId, group.memberId)
    return (<h1>Loading...</h1>)
  }

  return (
    <article className="container-fluid">
      <section>
        <Button className="row" href="https://sketch-life-academy.com/selan-help/">ヘルプ</Button>
      </section>

      <section>
        <img src="/images/logo.png" className="row col-6 col-sm-2 offset-3 offset-sm-5 img-fluid" alt="selan-logo" />
      </section>

      <section>
        <h1 className="text-right">残高<u>{token.holding ? token.holding: '---'} Selan</u></h1>
      </section>

      <section>
        <p className="warning-text">送金後の取り消しはできませんのでご注意ください</p>
        <SendTokenButton
          memberId={group.memberId}
          members={group.members}
          api={api}
          callback={() => {setTokenLoadingState(UserLoadingState.NOT_LOADED)}}
        />
      </section>

      <TransactionHistory
        group={group}
        transactionHistory={token.transactions}
      />
    </article>
  )
}

export default GroupIndex
