import React, { useState } from 'react';
import Modal from 'react-modal';
import { Navigate, useLocation, useMatch } from 'react-router-dom';

import RevisionUpdateMessage from 'components/RevisionUpdateMessage';

import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import MemberSettingsView from 'components/organisms/MemberSettingsView';
import HistoryPanel from 'components/organisms/HistoryPanel';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import ErrorMessage from 'components/ErrorMessage';
import SendTokenForm from 'components/organisms/SendTokenForm';
import SendTokenButton from 'components/atoms/SendTokenButton';
import ReceiveTokenButton from 'components/atoms/ReceiveTokenButton';

import { Group, GroupWithPermission, Record } from 'libs/GroupRepository';
import GroupRepository from 'libs/GroupRepository';
import { RestApi } from 'libs/thankshell';

import ReceiveTokenForm from 'components/organisms/ReceiveTokenForm';
import { useEnvironmentVariable, useSearchParams, useSession } from '../../libs/userHooks';
import PrimaryButton from 'components/atoms/PrimaryButton';
import { useEffect } from 'react';


Modal.setAppElement('#root');


type PageState = {
  mode: 'send',
  toMemberId?: string,
  amount?: number,
} | {
  mode: 'index',
} | {
  mode: 'receive',
};

export const parseSearchParameters = (search: string): {[key: string]: string} => {
  const buffer = search.split('?').slice(-1)[0];
  
  if (buffer) {
    return buffer.split('&')
      .map(p=>p.split('='))
      .map(kv=> ({[kv[0]]: kv[1]}))
      .reduce((v, r)=>({...v, ...r}), {});
  }

  return {};
};

const CreateGroupIndexPageView = ({
  localVersion,
  message,
  group,
  balance,
  records,
  modalElement,
  onSignOut,
  onUpdateMemberName,
  onOpenSendTokenModal,
  onOpenRecieveTokenModal,
}: {
  localVersion: string,
  message: string,
  group: GroupWithPermission,
  balance: number|null,
  records: Record[]|null,
  modalElement: JSX.Element|null,
  onSignOut: ()=>void,
  onUpdateMemberName: (value: string)=>Promise<void>,
  onOpenSendTokenModal: ()=>void,
  onOpenRecieveTokenModal: ()=>void,
}) => (
  <GroupIndexTemplate
    errorMessageElement={
      <>
        <ErrorMessage message={message}/>
        <RevisionUpdateMessage localVersion={localVersion} />
      </>
    }
    headerElement={
      <HeaderPanel
        groupId={group.groupName}
        groupName={group.groupName}
        logoUri={group.logoUri}
        memberSettingsView={(
          <MemberSettingsView
            memberId={group.memberId}
            memberName={group.members[group.memberId].displayName}
            onUpdateMemberName={onUpdateMemberName}
            onLogout={onSignOut}
          />
        )}
      />
    }
    controlPanelElement={
      <ControlPanel
        balance={balance}
        tokenName={group.tokenName}
        sendTokenButton={
          <>
            <SendTokenButton tokenName={group.tokenName} onClick={()=>onOpenSendTokenModal()}/>
            <ReceiveTokenButton text={`${group.tokenName}を受け取る`} onClick={onOpenRecieveTokenModal}/>
          </>
        }
      />
    }
    historyPanel={<HistoryPanel records={records||[]}/>}
    modalElement={modalElement}
    footerElement={<FooterPanel/>}
  />
);

const CreateModal = ({pageState, group, onClose, onSendToken}: {
  pageState: PageState,
  group: GroupWithPermission,
  onClose: ()=>void,
  onSendToken: (memberId: string, toMemberId: string, amount: number, comment: string) => Promise<void>,
}) => {
  switch(pageState.mode) {
    case 'receive':
      return (
        <Modal isOpen={true} onRequestClose={onClose}>
          <ReceiveTokenForm
            origin={window.location.origin}
            groupId={group.groupName}
            memberId={group.memberId}
            onClose={onClose}
          />
        </Modal>
      );
    case 'send':
      return (
        <Modal isOpen={true} onRequestClose={onClose}>
          <SendTokenForm
            defaultValue={{
              toMemberId: pageState.toMemberId,
              amount: pageState.amount,
            }}
            members={group.members}
            onSend={async(toMemberId, amount, comment)=>{
              await onSendToken(group.memberId, toMemberId, amount, comment);
              onClose();
            }}
          />
        </Modal>
      );
    case 'index':
      return null;
    default:
      throw new Error('Not implemented');
  }
};

const getDefaultState = (parameters: {[key: string]: string}): PageState => {
  if (parameters.mode === 'send') {
    return {
      mode: 'send',
      toMemberId: parameters.to_member_id,
      amount: parseInt(parameters.amount),
    }
  }

  return {mode: 'index'};
};

const GroupIndexPage = () => {
  const match = useMatch('/groups/:groupId');
  const groupId = match ? match.params.groupId : null;

  const location = useLocation();
  const searchParams = useSearchParams();
  const env = useEnvironmentVariable();

  const [session, signIn] = useSession();
  const [state, setState] = useState<PageState>(getDefaultState(searchParams));
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [group, setGroup] = useState<Group|null>(null);
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]|null>(null);

  useEffect(()=>{
    if (session && groupId) {
      const r = new GroupRepository(groupId, new RestApi(session, env.apiUrl));
      r.getGroup().then(setGroup).catch(()=>console.error("Fail to load"));
    }
  }, [session, env, groupId]);

  useEffect(()=>{
    if (session && groupId && group && group.permission !== 'visitor') {
      const r = new GroupRepository(groupId, new RestApi(session, env.apiUrl));

      const loadTransactions = async() => {
        setBalance(await r.getHolding(group.memberId));
        setRecords(await r.getTransactions(group, group.memberId));
      }

      loadTransactions();
    }
  }, [env, session, groupId, group]);

  if (session) {
    if (!groupId) {
      return null;
    }

    const restApi = new RestApi(session, env.apiUrl);
    const controller = new GroupRepository(groupId, restApi);
    const pathPrefix = `/groups/${groupId}`;

    if (!group) {
      return <p>group info Loading ...</p>
    }

    if (group.permission === 'visitor') {
      return <Navigate to={`${pathPrefix}/visitor`}/>
    }

    const onSendToken = async(memberId: string, toMemberId: string, amount: number, comment: string) => {
      await controller.send(memberId, toMemberId, amount, comment);

      setBalance(await controller.getHolding(group.memberId));
      setRecords(await controller.getTransactions(group, group.memberId));
    }

    const onUpdateMemberName = async(value: string)=>{
      try {
        await controller.updateMemberName(value);
      } catch(error) {
        setErrorMessage(error.message);
      }
    }

    return (
      <CreateGroupIndexPageView
        localVersion={env.version || ''}
        message={errorMessage}
        group={group}
        balance={balance}
        records={records}
        modalElement={<CreateModal
          pageState={state}
          group={group}
          onClose={()=>setState({mode: 'index'})}
          onSendToken={onSendToken}
        />}
        onSignOut={session.close}
        onUpdateMemberName={onUpdateMemberName}
        onOpenSendTokenModal={()=>setState({mode: 'send'})}
        onOpenRecieveTokenModal={()=>setState({mode: 'receive'})}
      />
    );
  } else {
    return (
      <div>
        <h2>サインインされていません</h2>
        <PrimaryButton text='Sign In' onClick={()=>signIn(location.pathname + location.search)} />
      </div>
    );
  }
};

export default GroupIndexPage;
