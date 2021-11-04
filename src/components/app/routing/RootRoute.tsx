import React from 'react';
import { Route, Switch } from 'react-router-dom'

// Sub-Router
import GroupPageRoute from './GroupPageRoute';

// Utility Component
import { EnvironmentVariables } from 'components/app/LoadEnv';
import UseSession from 'components/app/UseSession';

import FooterPanel from 'components/organisms/FooterPanel';
import LoginCallback from 'components/public/LoginCallback'

import PrivacyPolicyPage from 'components/pages/PrivacyPolicyPage';
import TosPage from 'components/pages/TosPage';
import TopPage from 'components/pages/TopPage';
import NotFoundPage from 'components/pages/NotFoundPage';


import { SignIn } from 'libs/auth';


const RootRoute = ({env}: {env: EnvironmentVariables}) => {
  return (
    <Switch>
      <Route path="/" exact>
        <TopPage onSignIn={()=>SignIn('/groups/sla')}/>
      </Route>
      <Route path="/tos" exact>
        <TosPage/>
      </Route>
      <Route path="/privacy-policy" exact>
        <PrivacyPolicyPage/>
      </Route>
      <Route path='/login/callback' exact render={(routeProps)=>(
        <>
          <LoginCallback {...routeProps}/>
          <footer>
            <FooterPanel/>
          </footer>
        </>
      )}/>
      <Route path='/groups/:id' render={(routeProps)=>(
        <UseSession
          callbackPath={routeProps.location.pathname + routeProps.location.search}
          render={({session, onSignOut})=> (
            <GroupPageRoute env={env} groupId={routeProps.match.params.id} session={session} onSignOut={onSignOut}/>
          )}
        />
      )}/>
      <Route path='*' component={NotFoundPage} />
    </Switch>
  );
};

export default RootRoute;
