import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { NotFoundPage } from '../../public/Error'

import GroupPageRoute from './GroupPageRoute';
import PublicPageRouting from './PublicPageRouting';
import { EnvironmentVariables } from 'components/app/LoadEnv';
import UseSession from 'components/app/UseSession';



const RootRoute = ({env}: {env: EnvironmentVariables}) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/groups/:id' render={(routeProps)=>(
          <UseSession
            callbackPath={routeProps.location.pathname + routeProps.location.search}
            render={({session, onSignOut})=> (
              <GroupPageRoute env={env} groupId={routeProps.match.params.id} session={session} onSignOut={onSignOut}/>
            )}
          />
        )}/>
        <PublicPageRouting/>
        <Route path='*' component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default RootRoute;
