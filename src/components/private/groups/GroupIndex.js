import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import SendTokenButton from './SendTokenButton.js'
import TransactionHistory from './TransactionHistory.js'
import './GroupIndex.css'


const GroupIndex = ({group, api, token, setToken}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setLoading] = useState(false)
  const loadToken = async(groupId, userId) => {
    if (isLoading) { return }
    setLoading(true)

    try {
      setToken({
        updatedAt: new Date().getTime(),
        holding: await api.getHolding(groupId, userId),
        transactions: await api.loadTransactions(groupId, userId)
      })
    } catch(e) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (errorMessage) {
    return (<Alert>ERROR: {errorMessage}</Alert>)
  }

  if (!token) {
    loadToken(group.groupId, group.memberId)
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
          callback={() => { setToken(null) }}
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
