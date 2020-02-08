import React from 'react'
import LogoutButton from './LogoutButton.js'

const UserConfig = (props) => {
  return (
    <section>
      <h4>ID: {props.user ? props.user.user_id : '-----'}</h4>
      <LogoutButton auth={props.auth} />
    </section>
  )
}

export default UserConfig
