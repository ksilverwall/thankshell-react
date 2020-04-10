import React from 'react'
import { Link } from 'react-router-dom'

const PrivateArea = ({auth, children}) => {
  return auth.isUserSignedIn() ? children : (
    <div>
      <h2>ログインされていません</h2>
      <Link to="/" className="nav-item nav-link">TOP</Link>
    </div>
  )
}

export default PrivateArea
