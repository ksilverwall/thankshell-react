import React from 'react'
import { Link } from 'react-router-dom'
import { ThankshellApi, RestApi, Session } from '../../libs/thankshell.js'
import LoadGroup from '../../containers/LoadGroup'

const PrivateArea = ({renderProps, auth}) => {
  return (
    <React.Fragment>
      {
        auth.isUserSignedIn() ? (
          <LoadGroup
            {...renderProps}
            auth={auth}
            api={
              new ThankshellApi(
                new RestApi(new Session(auth), process.env.REACT_APP_THANKSHELL_API_URL)
              )
            }
          />
        ) : (
          <div>
            <h2>ログインされていません</h2>
            <Link to="/" className="nav-item nav-link">TOP</Link>
          </div>
        )
      }
    </React.Fragment>
  )
}

export default PrivateArea
