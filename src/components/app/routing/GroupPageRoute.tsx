import React from 'react';
import { Route, Switch } from 'react-router-dom';

import GroupIndexPage from 'components/pages/GroupIndexPage';
import GroupVisitorPage from 'components/pages/GroupVisitorPage';
import GroupEntryPage from 'components/pages/GroupEntryPage';
import GroupAdminPage from 'components/pages/GroupAdminPage';
import NotFoundPage from 'components/pages/NotFoundPage'

import "react-router-tabs/styles/react-router-tabs.css";


const GroupPageRoute = ({groupId}: {groupId: string}) => {
  const pathPrefix = `/groups/${groupId}`;

  return (
    <Switch>
      <Route path={pathPrefix} exact={true}>
        <GroupIndexPage groupId={groupId}/>
      </Route>
      <Route path={`${pathPrefix}/visitor`}>
        <GroupVisitorPage/>
      </Route>
      <Route path={`${pathPrefix}/entry`} exact={true}>
        <GroupEntryPage groupId={groupId}/>
      </Route>
      <Route path={`${pathPrefix}/admin`}>
        <GroupAdminPage groupId={groupId}/>
      </Route>
      <Route path='*' component={NotFoundPage} />
    </Switch>
  );
}

export default GroupPageRoute;
