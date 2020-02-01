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
