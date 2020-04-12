import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { Button, Alert, Dropdown, ButtonGroup } from 'react-bootstrap'
import { RoutedTabs, NavTab } from "react-router-tabs"
import { NotFoundPage } from '../../public/Error.js'
import LoadGroupIndex from '../../../containers/LoadGroupIndex.js'
import LoadGroupAdmin from '../../../containers/LoadGroupAdmin.js'
import UpdateUser from '../../../containers/UpdateUser.js'
import EntryToGroup from '../../../containers/EntryToGroup.js'
import "react-router-tabs/styles/react-router-tabs.css";


const VisitorArticle = ({groupId}) => (
  <article>
    <p>{groupId}はプライベートグループです</p>
    <p>招待リンクを使用して参加してください</p>
  </article>
)

const UserEditButton = ({user, onClick}) => {
  return (
    <Button onClick={onClick}>
      {user ? user.displayName : '----'}さん
    </Button>
  )
}

const GroupMain = ({
  auth,
  groupId,
  api,
  location,
  group,
  user,
}) => {
  return (
    <main>
      <RoutedTabs startPathWith={`/groups/${groupId}`}>
        <NavTab exact to='/'>ホーム</NavTab>
        {
          (group.permission === 'admin') ? (
            <NavTab to='/admin'>管理</NavTab>
          ) : null
        }
        <NavTab to='/user'>ユーザ</NavTab>
      </RoutedTabs>
      <Switch>
        <Route
          path='/groups/:id/entry'
          extract={true}
          render={() =>
            (group.permission === 'visitor') ? (
              <EntryToGroup
                location={location}
                groupId={groupId}
                api={api}
              />
            ) : (
              <Redirect to={`/groups/${groupId}`}/>
            )
          }
        />
        <Route
          path='/groups/:id/user'
          extract={true}
          render={(props) =>
            (group.permission === 'visitor') ? (
              <VisitorArticle groupId={groupId}/>
            ) : (
              <UpdateUser
                {...props}
                user={user}
                auth={auth}
                api={api}
              />
            )
          }
        />
        <Route
          exact
          path='/groups/:id'
          render={internalProps =>
            (group.permission === 'visitor') ? (
              <VisitorArticle groupId={groupId}/>
            ) : (
              <LoadGroupIndex
                {...internalProps}
                auth={auth}
                api={api}
                user={user}
                group={group}
              />
            )
          }
        />
        <Route
          exact
          path='/groups/:id/admin'
          render={internalProps =>
            (group.permission === 'visitor') ? (
              <VisitorArticle groupId={groupId}/>
            ) : (
              <LoadGroupAdmin
                {...internalProps}
                auth={auth}
                api={api}
                user={user}
                group={group}
              />
            )
          }
        />
        <Route path='*' component={NotFoundPage} />
      </Switch>
    </main>
  )
}

const GroupsRouter = ({
  auth,
  groupId,
  api,
  location,
  history,
  // Loaded status from container
  group,
  user,
  errorMessage,
  unloaded,
  loading,
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

  if (loading) {
    return (<h1>Loading...</h1>)
  }

  return (
    <React.Fragment>
      <header>
        <Dropdown as={ButtonGroup}>
          <Button variant="success" onClick={()=>history.push(`/groups/${groupId}`)}>{groupId}</Button>
          {
            user && user.groups && user.groups.length > 0 ? (
              <React.Fragment>
                <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
                <Dropdown.Menu>
                  {
                    user.groups.map((gId, index) => (
                      <Dropdown.Item key={index} onClick={()=>history.push(`/groups/${gId}`)}>{gId}</Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </React.Fragment>
            ) : null
          }
        </Dropdown>
      </header>
      {
        (user && group) ? (
          <GroupMain
            auth={auth}
            groupId={groupId}
            api={api}
            location={location}
            group={group}
            user={user}
          />
        ) : null
      }
    </React.Fragment>
  )
}

export default GroupsRouter
