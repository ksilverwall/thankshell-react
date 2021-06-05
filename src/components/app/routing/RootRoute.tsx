import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'

import { NotFoundPage } from '../../public/Error'

import GroupIndexPage from 'components/pages/GroupIndexPage'
import { RestApi, Session, ThankshellApi } from 'libs/thankshell';
import { EnvironmentVariables } from 'components/app/LoadEnv';
import UseSession from 'components/app/UseSession';
import LoadGroup from 'components/app/LoadGroup';
import GroupRepository from 'libs/GroupRepository';
import LoadTransactions from '../LoadTransactions';
import { GetCognitoAuth } from 'libs/auth';
import FooterPanel from 'components/organisms/FooterPanel';
import LoadGroupLegacy from 'containers/LoadGroup'
import LoginCallback from '../../public/LoginCallback'
import { Tos, PrivacyPolicy } from '../../public/Constants'
import SignInButton from 'components/SignInButton';
import Top from '../../public/Top'


const GroupPageRoute = ({env, groupId, session, onSignOut}: {
  env: EnvironmentVariables,
  groupId: string,
  session: Session,
  onSignOut: ()=>void,
}) => {
  const [message, setMessage] = useState<string>('');
  const restApi = new RestApi(session, env.apiUrl);
  const controller = new GroupRepository(groupId, restApi);

  return (
    <Switch>
      <Route
        path='/groups/:id'
        exact={true}
        render={()=>{
          return (
            <LoadGroup
              groupRepository={controller}
              render={({group})=>group
                ? (
                  <LoadTransactions
                    controller={controller}
                    group={group}
                    render={({balance, records, onUpdated})=>{
                      const onSendToken = async(memberId: string, toMemberId: string, amount: number, comment: string) => {
                        await controller.send(memberId, toMemberId, amount, comment);
                        onUpdated();
                      }
                      const onUpdateMemberName = async(value: string)=>{
                        try {
                          await controller.updateMemberName(value);
                        } catch(error) {
                          setMessage(error.message);
                        }
                      }

                      return <GroupIndexPage {...{
                        message,
                        group,
                        balance,
                        records,
                        onUpdateMemberName,
                        onSendToken,
                        onSignOut,
                      }}/>
                    }}
                  />
                )
                : <p>Loading ...</p>
              }
            />
          );
        }}
      />
      <LoadGroupLegacy
        auth={session.auth}
        groupId={groupId}
        api={new ThankshellApi(restApi)}
        onSignOut={onSignOut}
      />
    </Switch>
  );
}

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
        {
          [
            {
              path: '/',
              extract: true,
              component: Top,
            },
            {
              path: '/tos',
              extract: true,
              component: Tos,
            },
            {
              path: '/privacy-policy',
              extract: true,
              component: PrivacyPolicy,
            },
            {
              path: '/login/callback',
              extract: true,
              component: LoginCallback,
            },
          ].map(({path, extract, component: C}, index) => (
            <Route key={`global_${index}`} path={path} exact={extract} render={(routeProps)=>(
              <>
                <C {...routeProps}/>
                <footer>
                  <FooterPanel/>
                </footer>
              </>
            )} />
          ))
        }
        <Route path='*' component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default RootRoute;
