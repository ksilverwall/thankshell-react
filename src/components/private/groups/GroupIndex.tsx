import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import SendTokenButton from './SendTokenButton'
import TransactionHistory from './TransactionHistory'
import ErrorMessage from '../../ErrorMessage'
import './GroupIndex.css'

const LoadingState = {
  INIT: 'INIT',
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
}

const HoldingSection = ({groupId, memberId, api, tokenUpdatedAt, onError}) => {
  const [loadingState, setLoadingState] = useState(LoadingState.INIT)
  const [holding, setHolding] = useState()

  const loadHoldings = async() => {
    if (loadingState !== LoadingState.INIT) { return }
    setLoadingState(LoadingState.LOADING)
    try {
      setHolding(await api.getHolding(groupId, memberId))
    } catch(err) {
      onError(err.message)
    } finally {
      setLoadingState(LoadingState.COMPLETE)
    }
  }

  if(!holding) { loadHoldings() }

  return (
    <section>
      <h1 className="text-right">残高<u>{holding ? holding: '---'} Selan</u></h1>
    </section>
  )
}

const GroupIndex = ({group, api, token, setToken}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [generalErrorMessage, setGeneralErrorMessage] = useState('')
  const [loadingState, setLoadingState] = useState(LoadingState.INIT)

  const loadToken = async(groupId, userId) => {
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
      <ErrorMessage message={generalErrorMessage}/>
      <section>
        <Button className="row" href="https://sketch-life-academy.com/selan-help/">ヘルプ</Button>
      </section>

      <section>
        <img src="/images/logo.png" className="row col-6 col-sm-2 offset-3 offset-sm-5 img-fluid" alt="selan-logo" />
      </section>

      <HoldingSection
        groupId={group.groupId}
        memberId={group.memberId}
        api={api}
        tokenUpdatedAt={token.updatedAt}
        onError={(message) => setGeneralErrorMessage(message)}
      />

      <section>
        <p className="warning-text">送金後の取り消しはできませんのでご注意ください</p>
        <SendTokenButton
          groupId={group.groupId}
          memberId={group.memberId}
          members={group.members}
          api={api}
          callback={() => { setToken(null) }}
        />
      </section>

      <TransactionHistory
        group={group}
        api={api}
      />
    </article>
  )
}

export default GroupIndex
