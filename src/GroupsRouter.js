import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { NotFoundPage } from './Error.js'
import LoadGroupIndex from './containers/LoadGroupIndex'
import LoadGroupAdmin from './containers/LoadGroupAdmin'
import { GetThankshellApi } from './thankshell'

const GroupsRouter = ({auth}) => (
  <React.Fragment>
    <header>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <div className="navbar-nav">
          <a className="nav-item nav-link" href="/groups/sla">ホーム </a>
          <a className="nav-item nav-link" href="/user/config">設定</a>
        </div>
      </nav>
    </header>
    <main>
      <Switch>
        <Route
          exact
          path='/groups/:id'
          render={props => (
            <LoadGroupIndex
              {...props}
              auth={auth}
              api={GetThankshellApi(auth)}
            />)}
        />
        <Route
          exact
          path='/groups/:id/admin'
          render={props => (
            <LoadGroupAdmin
              {...props}
              auth={auth}
              api={GetThankshellApi(auth)}
            />)}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </main>
  </React.Fragment>
)

export default GroupsRouter
