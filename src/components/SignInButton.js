import React from 'react'
import { Button } from 'react-bootstrap';
import { SignIn } from '../libs/auth.js'

const SignInButton = ({callbackPath}) => (
  <Button variant="primary" onClick={() => SignIn(callbackPath)}>Sign In</Button>
)

export default SignInButton
