import React from 'react';
import { Route } from 'react-router-dom'

import FooterPanel from 'components/organisms/FooterPanel';
import LoginCallback from 'components/public/LoginCallback'
import { Tos, PrivacyPolicy } from 'components/public/Constants'
import Top from 'components/public/Top'



const PublicPageRouting = () => {
  return (
    <>
      {[
        {
          path: '/',
          component: Top,
        },
        {
          path: '/tos',
          component: Tos,
        },
        {
          path: '/privacy-policy',
          component: PrivacyPolicy,
        },
        {
          path: '/login/callback',
          component: LoginCallback,
        },
      ].map(({path, component: C}, index) => (
        <Route key={`global_${index}`} path={path} exact render={(routeProps)=>(
          <>
            <C {...routeProps}/>
            <footer>
              <FooterPanel/>
            </footer>
          </>
        )} />
      ))}
    </>
  );
};

export default PublicPageRouting;
