import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { Alert, Dropdown, DropdownButton } from 'react-bootstrap'
import GroupAdmin from './GroupAdmin'
import GroupIndexVisitorPage from './GroupIndexVisitorPage.js'
import { NotFoundPage } from '../../public/Error.js'
import { UserLoadingState } from '../../../actions'
import LoadGroupIndex from '../../../containers/LoadGroupIndex.js'
import LoadGroupAdmin from '../../../containers/LoadGroupAdmin.js'
import UpdateUser from '../../../containers/UpdateUser.js'
import RegisterUser from '../../../containers/RegisterUser.js'

const GroupsRouter = (props) => {
  const {auth, user, group, api, openRegisterUser, userLoadingState} = props

  if (openRegisterUser) {
    const isStandby = [
      UserLoadingState.NOT_LOADED,
      UserLoadingState.LOADING,
      UserLoadingState.SAVING,
    ].includes(userLoadingState)

    return (
      <RegisterUser
        api={api}
        auth={auth}
        user={user}
        disabled={isStandby}
      />
    )
  }

  if (props.groupLoadingState === UserLoadingState.ERROR) {
    return (<Alert>ERROR: {props.group.error}</Alert>)
  }

  if (props.groupLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  if (props.groupLoadingState === UserLoadingState.NOT_LOADED) {
    props.loadGroup(props.match.params.id)

    return (<h1>Loading...</h1>)
  }

  if (!props.user) {
    return (<h1>Loading...</h1>)
  }

  if (props.group && !props.group.members.includes(props.user.user_id)) {
    return (<GroupIndexVisitorPage/>)
  }

  return (
    <React.Fragment>
      {
        user.groups.length >= 2 ? (
          <DropdownButton id="dropdown-basic-button" title={group.group_id}>
            {
              user.groups.map((groupId, index) => (
                <Dropdown.Item key={index} href={`/groups/${groupId}`}>{groupId}</Dropdown.Item>
              ))
            }
          </DropdownButton>
        ) : null
      }
      <main>
        <Switch>
          <Route
            path='/groups/:id/user'
            extract={true}
            render={(props) => (
              <UpdateUser
                {...props}
                user={user}
                auth={auth}
                api={api}
              />
            )}
          />
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
              <LoadGroupAdmin
                {...internalProps}
                auth={auth}
                api={api}
                user={user}
                group={group}
              />
            )}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </React.Fragment>
  )
}

export default GroupsRouter
