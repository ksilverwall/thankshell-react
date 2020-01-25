import React from 'react'
import RegisterUser from './containers/RegisterUser'

const UserRegister = (props) => {
  if (props.user && props.user.status !== 'UNREGISTERED') {
    props.history.push('/groups/sla')
  }

  return (
    <RegisterUser {...props}/>
  )
}

export default UserRegister