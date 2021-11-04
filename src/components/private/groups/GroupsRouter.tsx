import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { RoutedTabs, NavTab } from "react-router-tabs"
import NotFoundPage from 'components/pages/NotFoundPage'
import GroupAdmin from 'components/private/groups/GroupAdmin'; 
import UserConfig from 'components/private/user/UserConfig';
import FooterPanel from 'components/organisms/FooterPanel';

import "react-router-tabs/styles/react-router-tabs.css";
import GroupEntry from './GroupEntry';


const VisitorArticle = ({groupId}: {groupId: string}) => (
  <article>
    <p>{groupId}はプライベートグループです</p>
    <p>招待リンクを使用して参加してください</p>
  </article>
)

const GroupMain = ({
  auth,
  groupId,
  api,
}: any) => {
  const location = useLocation();
  const [group, setGroup] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const loadGroup = async() => {
    if (isLoading) { return }
    setLoading(true)
    try {
      setGroup(await api.getGroup(groupId))
      setLoading(false)
    } catch(err) {
      setErrorMessage(`ERROR: ${err.message}`)
      setLoading(false)
    }
  }

  if (errorMessage) {
    return (<Alert>{errorMessage}</Alert>)
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
          exact={true}
          render={() =>
            (group.permission === 'visitor') ? (
              <GroupEntry
                location={location}
                groupId={groupId}
                api={api}
                setGroup={setGroup}
              />
            ) : (
              <Redirect to={`/groups/${groupId}`}/>
            )
          }
        />
        <Route
          path='/groups/:id/user'
          exact={true}
          render={(props) =>
            (group.permission === 'visitor') ? (
              <VisitorArticle groupId={groupId}/>
            ) : (
              <UserConfig
                memberId={group.memberId}
                memberDetail={group.members[group.memberId]}
                auth={auth}
                api={api}
                setGroup={setGroup}
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
              <GroupAdmin api={api} group={group}/>
            )
          }
        />
        <Route path='*' component={NotFoundPage} />
      </Switch>
      <footer>
        <FooterPanel/>
      </footer>
    </main>
  )
}

const GroupsRouter = ({
  auth,
  groupId,
  api,
  onSignOut,
}: any) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState();

  const loadUser = async() => {
    try {
      setUser(await api.getUser());
    } catch(err) {
      setErrorMessage(`User Load Error: ${err.message}`);
    }
  }

  useEffect(()=>{
    if (!user) { loadUser() }
  }, [user]);

  if (errorMessage) {
    return (<Alert>{errorMessage}</Alert>)
  }

  return (
    <GroupMain
      auth={auth}
      groupId={groupId}
      api={api}
    />
  )
}

export default GroupsRouter
