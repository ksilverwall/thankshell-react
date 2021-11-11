import React, { useState } from 'react';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';

import LoadGroup from 'components/app/LoadGroup';
import LoadUser from 'components/app/LoadUser';
import RevisionUpdateMessage from 'components/RevisionUpdateMessage';

import FooterPanel from 'components/organisms/FooterPanel';
import SyncActionButton from 'components/atoms/SyncActionButton';
import PrimaryButton from 'components/atoms/PrimaryButton';
import ErrorMessage from 'components/ErrorMessage';

import UserRepository from 'libs/UserRepository';
import GroupRepository from 'libs/GroupRepository';
import { RestApi } from 'libs/thankshell';
import { useEnvironmentVariable, useSearchParams, useSession } from 'libs/userHooks';


const GroupEntryPage = () => {
  const match = useMatch('/groups/:groupId/*');
  const groupId = match ? match.params.groupId : null;

  const groupTopUrl = `/groups/${groupId}`;
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const env = useEnvironmentVariable();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [session, signIn] = useSession();

  if (!groupId) {
    return null;
  }

  if (!session) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <PrimaryButton text='Sign In' onClick={()=>signIn(location.pathname + location.search)} />
      </div>
    )
  }

  const api = new RestApi(session, env.apiUrl);
  const groupRepository = new GroupRepository(groupId, api);

  const article = (
    <LoadUser
      repository={new UserRepository(groupId, api)}
      onError={(msg)=>setErrorMessage(`User Load Error: ${msg}`)}
      render={()=>(
        <LoadGroup
          groupRepository={groupRepository}
          render={({group})=>{
            if (!group) {
              return <h1>Loading...</h1>;
            }

            const entry = async() => {
              try {
                await groupRepository.entryToGroup(searchParams);
                navigate(groupTopUrl);
              } catch(err) {
                if (err instanceof Error){
                  setErrorMessage(`招待リンクが無効です: ${err.message}`);
                }
              }
            }

            return (group.permission === 'visitor') ? (
              <div>
                <p>グループ『{groupId}』に招待されています</p>
                <SyncActionButton text="参加" onClick={entry}/>
              </div>
            ) : (
              <div>
                <p>グループ『{groupId}』に登録済みです</p>
                <PrimaryButton text="トップへ" onClick={()=>navigate(groupTopUrl)}/>
              </div>
            );
          }
        }/>
      )}
    />
  );

  return (
    <main>
      <header>
        <RevisionUpdateMessage localVersion={env.version || ''} />
        <ErrorMessage message={errorMessage}/>
      </header>
      <article>
        {article}
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </main>
  );
}

export default GroupEntryPage;
