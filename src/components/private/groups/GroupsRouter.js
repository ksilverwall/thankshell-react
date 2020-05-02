import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { Button, Alert, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
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

const GroupMain = ({
  auth,
  groupId,
  api,
  location,
  group,
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
                memberId={group.memberId}
                memberDetail={group.members[group.memberId]}
                auth={auth}
                api={api}
              />
            )
          }
        />
        <Route
          exact
          path='/groups/:id'
          render={() =>
            (group.permission === 'visitor') ? (
              <VisitorArticle groupId={groupId}/>
            ) : (
              <LoadGroupIndex
                api={api}
                group={group}
              />
            )
          }
        />
        <Route
          exact
          path='/groups/:id/admin'
          render={() =>
            (group.permission === 'visitor') ? (
              <VisitorArticle groupId={groupId}/>
            ) : (group.permission !== 'admin') ? (
              <h1>アクセス権限がありません</h1>
            ) : (
              <LoadGroupAdmin
                api={api}
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
        <DropdownButton title={groupId}>
          {
            user && user.groups
              ? user.groups.map((gId, index) => (
                <Dropdown.Item key={index} onClick={()=>history.push(`/groups/${gId}`)}>{gId}</Dropdown.Item>
              ))
              : null
          }
        </DropdownButton>
      </header>
      {
        (group) ? (
          <GroupMain
            auth={auth}
            groupId={groupId}
            api={api}
            location={location}
            group={group}
          />
        ) : null
      }
    </React.Fragment>
  )
}

export default GroupsRouter
