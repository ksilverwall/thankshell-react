import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap'
import { Redirect, useLocation } from 'react-router-dom';

import UseSession from 'components/app/UseSession';
import LoadEnv from 'components/app/LoadEnv';
import LoadGroup from 'components/app/LoadGroup';
import LoadUser from 'components/app/LoadUser';
import RevisionUpdateMessage from 'components/RevisionUpdateMessage';

import FooterPanel from 'components/organisms/FooterPanel';

import UserRepository from 'libs/UserRepository';
import GroupRepository from 'libs/GroupRepository';
import { RestApi, ThankshellApi } from 'libs/thankshell';


import "react-router-tabs/styles/react-router-tabs.css";
import { useSearchParams } from 'libs/userHooks';


const EntryButton = ({api, groupId, params, onComplete, onFailed}: {
  api: ThankshellApi,
  groupId: string,
  params: {[key: string]: string},
  onComplete: ()=>void,
  onFailed: (message: string)=>void,
} ) => {
  const [processing, setProcessing] = useState<boolean>(false);

  const entry = async () => {
    try {
      setProcessing(true);
      await api.entryToGroup(groupId, params);
      setProcessing(false);
      onComplete()
    } catch(err) {
      setProcessing(false);
      onFailed(`招待リンクが無効です: ${err.message}`)
    }
  }

  return <Button onClick={entry} disabled={processing}>参加</Button>;
}

const GroupEntry = ({location, groupId, api, setGroup}: any) => {
  const onEntry = () => setGroup(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const searchParams = useSearchParams();

  return (
    <article>
      {
        (errorMessage) ? (
          <Alert variant="danger">{errorMessage}</Alert>
        ) : null
      }
      <p>グループ『{groupId}』に招待されています</p>
      <EntryButton
        api={api}
        groupId={groupId}
        params={searchParams}
        onComplete={onEntry}
        onFailed={(message: string) => setErrorMessage(message)}
      />
    </article>
  );
};

const GroupEntryPage = ({groupId}: {groupId: string}) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const location = useLocation();

  return (
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

                      return (
                        <main>
                          {
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
                          <footer>
                            <FooterPanel/>
                          </footer>
                        </main>
                      );
                    }
                  }/>
                )}
              />
            );
          }}
        />
      </>
    )}/>
  );
}

export default GroupEntryPage;
