import React from 'react';
import queryString from 'query-string'
import { Alert } from 'react-bootstrap'
import { UserLoadingState } from '../../../actions'

const GroupEntry = ({location, groupId, entry, userLoadingState, userRegisterError}) => {
  if (userLoadingState == UserLoadingState.ERROR) {
    return (<Alert>ERROR: {userRegisterError}</Alert>)
  }

  if (userLoadingState == UserLoadingState.LOADED) {
    const params = queryString.parse(location.search)
    entry(params.m)
    return (
        <a>グループ『{groupId}』に参加する処理をしています</a>
    )
  }

  return null
}

export default GroupEntry
