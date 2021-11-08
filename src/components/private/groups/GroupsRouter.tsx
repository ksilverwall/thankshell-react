import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import NotFoundPage from 'components/pages/NotFoundPage'
import GroupAdmin from 'components/private/groups/GroupAdmin'; 
import FooterPanel from 'components/organisms/FooterPanel';

import "react-router-tabs/styles/react-router-tabs.css";
import GroupEntry from './GroupEntry';
import { Group } from 'libs/GroupRepository';


const GroupMain = ({
  auth,
  groupId,
  api,
}: any) => {
  const location = useLocation();
  const [group, setGroup] = useState<Group>();
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
        {
          displayedAdminPage ? (
            <Route
              exact
              path='/groups/:id/admin'
            >
              <GroupAdmin api={api} group={group}/>
            </Route>
          ) : null
        }
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
