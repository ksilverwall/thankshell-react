import React from 'react'
import { Button } from 'react-bootstrap'

export default function LogoutButton({onClick}: {onClick: ()=>void}) {
  return (
    <Button variant="primary" onClick={onClick}>
      ログアウト
    </Button>
  )
}
