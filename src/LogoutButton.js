import React from 'react'
import { Button } from 'react-bootstrap'

export default function LogoutButton(props) {
  return (
    <Button variant="primary" onClick={() => {props.auth.signOut()}}>
      ログアウト
    </Button>
  )
}
