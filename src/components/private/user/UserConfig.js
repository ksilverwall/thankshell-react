import React from 'react'
import LogoutButton from './LogoutButton.js'

const UserConfig = (props) => {
  if (props.user && props.user.status === 'UNREGISTERED') {
    props.history.push('/groups/sla')
  }

  const userId = (props.user && props.user.status === 'ENABLE')
    ? props.user.user_id
    : '-----'

  return (
    <section>
      <h4>ID: {userId}</h4>
      <LogoutButton auth={props.auth} />
    </section>
  )
}

export default UserConfig
