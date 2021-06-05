import React, {useState} from 'react';
import { Route, Switch, Link, Redirect, useLocation, useHistory } from 'react-router-dom'
import { Button, Alert, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import { RoutedTabs, NavTab } from "react-router-tabs"
import { NotFoundPage } from '../../public/Error'
import LoadGroupIndex from '../../../containers/LoadGroupIndex'
import LoadGroupAdmin from '../../../containers/LoadGroupAdmin'
import UpdateUser from '../../../containers/UpdateUser'
import EntryToGroup from '../../../containers/EntryToGroup'
import "react-router-tabs/styles/react-router-tabs.css";
import FooterPanel from 'components/organisms/FooterPanel';


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
  setGroup,
}) => {
  const [groupLoadingErrorMessage, setGroupLoadingErrorMessage] = useState('')
  const [isLoading, setLoading] = useState(false)
  const loadGroup = async() => {
    if (isLoading) { return }
    setLoading(true)
    try {
      setGroup(await api.getGroup(groupId))
      setLoading(false)
    } catch(err) {
      setGroupLoadingErrorMessage(err.message)
      setLoading(false)
    }
  }

  if (groupLoadingErrorMessage) {
    return (<Alert>ERROR: {groupLoadingErrorMessage}</Alert>)
  }

  if (!group || group.groupId !== groupId) {
    loadGroup()

    return (<h1>Loading...</h1>)
  }

  const displayedAdminPage = ['admin', 'owner'].includes(group.permission);
  return (
    <main>
      <RoutedTabs startPathWith={`/groups/${groupId}`}>
        <NavTab exact to='/'>ホーム</NavTab>
        {
          displayedAdminPage ? (
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
            ) : !displayedAdminPage ? (
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
  onSignOut,
  // Loaded status from container
  user,
  group,
  // Callback function to conteiner
  setUser,
  setGroup,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [userLoadingErrorMessage, setUserLoadingErrorMessage] = useState('')

  const loadUser = async() => {
    try {
      setUser(await api.getUser())
    } catch(err) {
      setUserLoadingErrorMessage(err.message)
    }
  }

  if (userLoadingErrorMessage) {
    return (<Alert>User Load Error: {userLoadingErrorMessage}</Alert>)
  }

  if (!user) { loadUser() }

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
      <GroupMain
        auth={auth}
        groupId={groupId}
        api={api}
        location={location}
        group={group}
        setGroup={setGroup}
      />
      <footer>
        <FooterPanel/>
      </footer>
    </React.Fragment>
  )
}

export default GroupsRouter
