import React from 'react';
import { Route, Switch } from 'react-router-dom'

// Sub-Router
import GroupPageRoute from './GroupPageRoute';

import LoginCallbackPage from 'components/pages/LoginCallbackPage'
import PrivacyPolicyPage from 'components/pages/PrivacyPolicyPage';
import TosPage from 'components/pages/TosPage';
import TopPage from 'components/pages/TopPage';
import NotFoundPage from 'components/pages/NotFoundPage';

import { SignIn } from 'libs/auth';


const RootRoute = () => {
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
      <Route path='/login/callback' exact>
        <LoginCallbackPage/>
      </Route>
      <Route path='/groups/:id' render={({match})=>(
        <GroupPageRoute groupId={match.params.id}/>
      )}/>
      <Route path='*' component={NotFoundPage} />
    </Switch>
  );
};

export default RootRoute;
