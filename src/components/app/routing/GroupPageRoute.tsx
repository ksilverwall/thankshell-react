import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom'

import GroupIndexPage from 'components/pages/GroupIndexPage'
import { EnvironmentVariables } from 'components/app/LoadEnv';
import LoadGroup from 'components/app/LoadGroup';
import LoadTransactions from 'components/app/LoadTransactions';
import GroupsRouter from 'components/private/groups/GroupsRouter';

import GroupRepository from 'libs/GroupRepository';
import { RestApi, Session, ThankshellApi } from 'libs/thankshell';


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
      <GroupsRouter
        auth={session.auth}
        groupId={groupId}
        api={new ThankshellApi(restApi)}
        onSignOut={onSignOut}
      />
    </Switch>
  );
};

export default GroupPageRoute;
