import React from 'react'
import { Alert } from 'react-bootstrap'

import { UserLoadingState } from '../../actions'
import RegisterUser from '../../containers/RegisterUser.js'

const PrivateContents = ({
    renderProps,
    api,
    reloadUser,
    loadUser,
    component: C,
    auth,
    userLoadingState,
    user,
    openRegisterUser,
    errorMessage
}) => {
  if (errorMessage) {
    return (<Alert>ERROR: {errorMessage}</Alert>)
  }

  if (reloadUser) {
    loadUser()
  }

  if (openRegisterUser) {
    const isStandby = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING,
      UserLoadingState.SAVING,
    ].includes(userLoadingState)

    return (
      <RegisterUser
        api={api}
        auth={auth}
        user={user}
        disabled={isStandby}
      />
    )
  }

  return (<C
    {...renderProps}
    api={api}
    auth={auth}
    user={user}
  />)
}

export default PrivateContents
