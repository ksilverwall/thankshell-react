import React from 'react'
import LogoutButton from './LogoutButton.js'

const UserConfig = (props) => {
  return (
    <section>
      <h2>{props.user ? props.user.displayName : '-----'}</h2>
      <p>ID: {props.user ? props.user.user_id : '-----'}</p>
      <LogoutButton auth={props.auth} />
    </section>
  )
}

export default UserConfig
