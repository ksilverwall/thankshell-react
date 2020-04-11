import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { Alert, Dropdown, DropdownButton } from 'react-bootstrap'
import { NotFoundPage } from '../../public/Error.js'
import { UserLoadingState } from '../../../actions'
import LoadGroupIndex from '../../../containers/LoadGroupIndex.js'
import LoadGroupAdmin from '../../../containers/LoadGroupAdmin.js'
import UpdateUser from '../../../containers/UpdateUser.js'
import EntryToGroup from '../../../containers/EntryToGroup.js'

const Header = ()=> (
  <header>
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="navbar-nav">
        <Link to="/groups/sla" className="nav-item nav-link">ホーム</Link>
        <Link to="/groups/sla/user" className="nav-item nav-link">設定</Link>
      </div>
    </nav>
  </header>
)

const VisitorArticle = ({groupId}) => (
  <article>
    <p>{groupId}はプライベートグループです</p>
    <p>招待リンクを使用して参加してください</p>
  </article>
)

const GroupsRouter = ({
  auth,
  groupId,
  api,
  location,
  // Loaded status from container
  groupLoadingState,
  group,
  userLoadingState,
  user,
  errorMessage,
  unloaded,
  // Callback function to conteiner
  loadGroup,
}) => {
  if (errorMessage) {
    return (<Alert>ERROR: {errorMessage}</Alert>)
  }

  if (unloaded) {
    loadGroup(groupId)

    return (<h1>Loading...</h1>)
  }

  if (userLoadingState === UserLoadingState.LOADING || groupLoadingState === UserLoadingState.LOADING) {
    return (<h1>Loading...</h1>)
  }

  return (
    <React.Fragment>
      <Header/>
      <main>
        {
          user && user.groups && user.groups.length >= 2 ? (
            <DropdownButton id="dropdown-basic-button" title={groupId}>
              {
                user.groups.map((gId, index) => (
                  <Dropdown.Item key={index} href={`/groups/${gId}`}>{gId}</Dropdown.Item>
                ))
              }
            </DropdownButton>
          ) : null
        }
        {
          (group.permission === 'visitor') ? (
            <Switch>
              <Route
                path='/groups/:id/entry'
                extract={true}
                render={() => (
                  <EntryToGroup
                    location={location}
                    groupId={groupId}
                    api={api}
                    userLoadingState={userLoadingState}
                  />
                )}
              />
              <Route
                path='*'
                render={() => (
                  <VisitorArticle groupId={groupId}/>
                )}
              />
            </Switch>
          ) : (
            <Switch>
              <Route
                path='/groups/:id/entry'
                extract={true}
                render={() => (
                  <Redirect to={`/groups/${groupId}`}/>
                )}
              />
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
          )
        }
      </main>
    </React.Fragment>
  )
}

export default GroupsRouter
