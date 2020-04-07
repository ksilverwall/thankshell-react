import React from 'react'
import { Alert } from 'react-bootstrap'

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

  return (<C
    {...renderProps}
    api={api}
    auth={auth}
    user={user}
    openRegisterUser={openRegisterUser}
    userLoadingState={userLoadingState}
  />)
}

export default PrivateContents
