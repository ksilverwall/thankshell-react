import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { NotFoundPage } from './Error.js'
import LoadGroupIndex from './containers/LoadGroupIndex'
import GroupAdmin from './GroupAdmin'
import { GetThankshellApi } from './thankshell'
import { UserLoadingState } from './actions'
import GroupIndexVisitorPage from './GroupIndexVisitorPage'

const GroupsRouter = (props) => {
  const {auth, user, group} = props
  const api = GetThankshellApi(auth)

  //-----------------------------------------
  // FIXME: Move to private router
  if (props.userLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.user.error}</Alert>)
  }

  if (props.userLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.userLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadUser(api)
    return (<h1>Loading...</h1>)
  }

  if (props.user && props.user.status === 'UNREGISTERED') {
    props.history.push('/user/register')

    return (<p>redirecting...</p>)
  }
  //-----------------------------------------


  if (props.groupLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.group.error}</Alert>)
  }

  if (props.groupLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.groupLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadGroup(api, props.match.params.id)

    return (<h1>Loading...</h1>)
  }

  if (props.group && !props.group.members.includes(props.user.user_id)) {
    return (<Redirect to={`/groups/${props.match.params.id}/visitor`}/>)
  }

  return (
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
            render={internalProps => (
              <LoadGroupIndex
                {...internalProps}
                auth={auth}
                api={api}
                user={user}
                group={group}
              />
            )}
          />
          <Route
            exact
            path='/groups/:id/admin'
            render={internalProps => (
              <GroupAdmin
                {...internalProps}
                auth={auth}
                api={api}
                user={user}
                group={group}
              />
            )}
          />
          <Route
            exact
            path='/groups/:id/visitor'
            component={GroupIndexVisitorPage} 
          />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </React.Fragment>
  )
}

export default GroupsRouter
