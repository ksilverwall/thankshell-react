import React from 'react';
import { Route, Routes } from 'react-router-dom'

import LoginCallbackPage from 'components/pages/LoginCallbackPage'
import PrivacyPolicyPage from 'components/pages/PrivacyPolicyPage';
import TosPage from 'components/pages/TosPage';
import TopPage from 'components/pages/TopPage';
import NotFoundPage from 'components/pages/NotFoundPage';
import GroupIndexPage from 'components/pages/GroupIndexPage';
import GroupVisitorPage from 'components/pages/GroupVisitorPage';
import GroupEntryPage from 'components/pages/GroupEntryPage';
import GroupAdminPage from 'components/pages/GroupAdminPage';

import { SignIn } from 'libs/auth';


const RootRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage onSignIn={()=>SignIn('/groups/sla')}/>}/>
      <Route path="/tos" element={<TosPage/>}/>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
      <Route path='/login/callback' element={<LoginCallbackPage/>}/>
      <Route path='/groups/:id' element={<GroupIndexPage/>}>
        <Route path={'visitor'} element={<GroupVisitorPage/>}/>
        <Route path={'entry'} element={<GroupEntryPage/>}/>
        <Route path={'admin'} element={<GroupAdminPage/>}/>
        <Route path='*' element={<NotFoundPage/>} />
      </Route>
      <Route path='*' element={<NotFoundPage/>}>
      </Route>
    </Routes>
  );
};

export default RootRoute;
