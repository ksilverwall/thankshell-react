import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { NotFoundPage } from '../../public/Error'

import GroupIndexPage from 'components/pages/GroupIndexPage'
import LegacyRoute from './LegacyRoute'
import { RestApi } from 'libs/thankshell';
import LoadEnv from 'components/app/LoadEnv';
import UseSession from 'components/app/UseSession';
import LoadGroup from 'components/app/LoadGroup';
import GroupRepository from 'libs/GroupRepository';
import LoadTransactions from '../LoadTransactions';


export default () => {
  const [message, setMessage] = useState<string>('');

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path='/groups/:id'
          exact={true}
          render={(routeProps)=>(
            <LoadEnv render={(env)=>(
              <UseSession
                callbackPath={routeProps.location.pathname + routeProps.location.search}
                render={({session, onSignOut})=> {
                  const controller = new GroupRepository(routeProps.match.params.id, new RestApi(session, env.apiUrl));

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
            )}/>
          )}
        />
        <LegacyRoute/>
        <Route path='*' component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
};
