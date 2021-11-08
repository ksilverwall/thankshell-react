import React, { useState } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap'

import UseSession from 'components/app/UseSession';
import LoadEnv from 'components/app/LoadEnv';
import LoadGroup from 'components/app/LoadGroup';
import LoadUser from 'components/app/LoadUser';
import LoadTransactions from 'components/app/LoadTransactions';
import RevisionUpdateMessage from 'components/RevisionUpdateMessage';

import GroupEntry from 'components/private/groups/GroupEntry';
import GroupVisitorPage from 'components/pages/GroupVisitorPage';
import GroupIndexPage from 'components/pages/GroupIndexPage'

import UserRepository from 'libs/UserRepository';
import GroupRepository from 'libs/GroupRepository';
import { RestApi } from 'libs/thankshell';


import NotFoundPage from 'components/pages/NotFoundPage'
import GroupAdmin from 'components/private/groups/GroupAdmin'; 
import FooterPanel from 'components/organisms/FooterPanel';

import "react-router-tabs/styles/react-router-tabs.css";


const GroupPageRoute = ({groupId}: {groupId: string}) => {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const pathPrefix = `/groups/${groupId}`;

  return (
    <Switch>
      <Route
        path={pathPrefix}
        exact={true}
        render={()=>{
          return <LoadEnv render={(env)=>(
            <UseSession
              callbackPath={location.pathname + location.search}
              render={({session, onSignOut})=> {
                const restApi = new RestApi(session, env.apiUrl);
                const controller = new GroupRepository(groupId, restApi);
                const pathPrefix = `/groups/${groupId}`;

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
                                setErrorMessage(error.message);
                              }
                            }

                            return (
                              <>
                                <RevisionUpdateMessage localVersion={env.version || ''} />
                                <GroupIndexPage {...{
                                  message: errorMessage,
                                  group,
                                  balance,
                                  records,
                                  onUpdateMemberName,
                                  onSendToken,
                                  onSignOut,
                                }}/>
                              </>
                            )
                          }}
                        />
                      ) : <Redirect to={`${pathPrefix}/visitor`}/>
                      : <p>Loading ...</p>
                    }
                  />
                );
              }
            }/>
          )}/>
        }}
      />
      <Route path={`${pathPrefix}/visitor`}>
        <GroupVisitorPage/>
      </Route>
      <LoadEnv render={(env)=>(
        <>
          <RevisionUpdateMessage localVersion={env.version || ''} />
          <UseSession
            callbackPath={location.pathname + location.search}
            render={({session})=> {
              if (errorMessage) {
                return (<Alert>{errorMessage}</Alert>)
              }

              const api = new RestApi(session, env.apiUrl);

              return (
                <LoadUser
                  repository={new UserRepository(groupId, api)}
                  onError={(msg)=>setErrorMessage(`User Load Error: ${msg}`)}
                  render={()=>(
                    <LoadGroup
                      groupRepository={new GroupRepository(groupId, api)}
                      render={({group, setGroup})=>{
                        if (!group) {
                          return <h1>Loading...</h1>;
                        }

                        return <main>
                          <Switch>
                            <Route
                              path='/groups/:id/entry'
                              exact={true}
                              render={() =>
                                (group.permission === 'visitor') ? (
                                  <GroupEntry
                                    location={location}
                                    groupId={groupId}
                                    api={api}
                                    setGroup={setGroup}
                                  />
                                ) : (
                                  <Redirect to={`/groups/${groupId}`}/>
                                )
                              }
                            />
                            {
                              ['admin', 'owner'].includes(group.permission) ? (
                                <Route
                                  exact
                                  path='/groups/:id/admin'
                                >
                                  <GroupAdmin api={api} group={group}/>
                                </Route>
                              ) : null
                            }
                            <Route path='*' component={NotFoundPage} />
                          </Switch>
                          <footer>
                            <FooterPanel/>
                          </footer>
                        </main>
                      }
                    }/>
                  )}
                />
              );
            }}
          />
        </>
      )}/>
    </Switch>
  );
}

export default GroupPageRoute;
