import React from 'react'
import { Button } from 'react-bootstrap';


const SignInButton = ({onClick}: {onClick: ()=>void}) => (
  <Button variant="primary" onClick={onClick}>Sign In</Button>
)

export default SignInButton
