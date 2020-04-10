import React from 'react'
import SignInButton from '../SignInButton'
import { GetCognitoAuth } from '../../libs/auth.js'

const PrivateArea = ({location, children}) => {
  const auth = GetCognitoAuth()
  return auth.isUserSignedIn() ? children : (
    <div>
      <h2>サインインされていません</h2>
      <SignInButton callbackPath={location.pathname + location.search} />
    </div>
  )
}

export default PrivateArea
