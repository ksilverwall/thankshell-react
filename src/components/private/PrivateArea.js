import React from 'react'
import { Link } from 'react-router-dom'
import LoadPrivate from '../../containers/LoadPrivate'
import { ThankshellApi, RestApi, Session } from '../../libs/thankshell.js'

const PrivateArea = ({renderProps, auth, component}) => {
  return (
    <React.Fragment>
      <header>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="navbar-nav">
            <Link to="/groups/sla" className="nav-item nav-link">ホーム</Link>
            <Link to="/groups/sla/user" className="nav-item nav-link">設定</Link>
          </div>
        </nav>
      </header>
      {
        auth.isUserSignedIn() ? (
          <LoadPrivate
            renderProps={renderProps}
            auth={auth}
            component={component}
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
