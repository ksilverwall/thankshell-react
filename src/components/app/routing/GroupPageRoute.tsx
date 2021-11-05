import React, { useState } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import RevisionUpdateMessage from 'components/RevisionUpdateMessage';
import UseSession from 'components/app/UseSession';
import LoadEnv from 'components/app/LoadEnv';
import LoadGroup from 'components/app/LoadGroup';
import LoadTransactions from 'components/app/LoadTransactions';

import GroupVisitorPage from 'components/pages/GroupVisitorPage';
import GroupIndexPage from 'components/pages/GroupIndexPage'
import GroupsRouter from 'components/private/groups/GroupsRouter';

import GroupRepository from 'libs/GroupRepository';
import { RestApi, ThankshellApi } from 'libs/thankshell';


const GroupPageRoute = ({groupId}: {groupId: string}) => {
  const location = useLocation();
  const [message, setMessage] = useState<string>('');

  return <LoadEnv render={(env)=>(
    <>
      <RevisionUpdateMessage localVersion={env.version || ''} />
      <UseSession
        callbackPath={location.pathname + location.search}
        render={({session, onSignOut})=> {
          const restApi = new RestApi(session, env.apiUrl);
          const controller = new GroupRepository(groupId, restApi);
          const pathPrefix = `/groups/${groupId}`;

          return (
            <Switch>
              <Route
                path={pathPrefix}
                exact={true}
                render={()=>{
                  return (
                    <LoadGroup
                      groupRepository={controller}
                      render={({group})=>group
                        ? group.permission !== 'visitor' ? (
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
                        ) : <Redirect to={`${pathPrefix}/visitor`}/>
                        : <p>Loading ...</p>
                      }
                    />
                  );
                }}
              />
              <Route path={`${pathPrefix}/visitor`}>
                <GroupVisitorPage/>
              </Route>
              <GroupsRouter
                auth={session.auth}
                groupId={groupId}
                api={new ThankshellApi(restApi)}
                onSignOut={onSignOut}
              />
            </Switch>
          )
        }}
      />
    </>
  )}/>
}

export default GroupPageRoute;
