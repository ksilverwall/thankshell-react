import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
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
import { Group, Record } from 'libs/GroupRepository';
import ReceiveTokenForm from 'components/organisms/ReceiveTokenForm';
import { useLocation } from 'react-router';


Modal.setAppElement('#root');


const parseSearchParameters = (search: string): {[key: string]: string} => {
  const buffer = search.split('?').slice(-1)[0];
  
  if (buffer) {
    return buffer.split('&')
      .map(p=>p.split('='))
      .map(kv=> ({[kv[0]]: kv[1]}))
      .reduce((v, r)=>({...v, ...r}), {});
  }

  return {};
};

const GroupIndexPage = ({message, group, balance, records, onUpdateMemberName, onSendToken, onSignOut}:{
  message: string,
  group: Group,
  balance: number|null,
  records: Record[],
  onUpdateMemberName: (value: string) => Promise<void>,
  onSendToken: (memberId: string, toMemberId: string, amount: number, comment: string) => Promise<void>,
  onSignOut: ()=>void,
}) => {
  const location = useLocation();

  const [modalElement, setModalElement] = useState<JSX.Element|null>(null);
  const [parameters, setParameters] = useState<{[key: string]: string}>({});

  const onClose = ()=>setModalElement(null);
  const onOpenSendTokenModal = (defaultValue: {toMemberId?: string, amount?: number} = {}) => setModalElement(
    <Modal isOpen={true} onRequestClose={onClose}>
      <SendTokenForm
        defaultValue={defaultValue}
        members={group.members}
        onSend={async(toMemberId, amount, comment)=>{
          await onSendToken(group.memberId, toMemberId, amount, comment);
          onClose();
        }}
      />
    </Modal>
  );
  const onOpenRecieveTokenModal = () => setModalElement(
    <Modal isOpen={true} onRequestClose={onClose}>
      <ReceiveTokenForm
        origin={window.location.origin}
        groupId={group.groupName}
        memberId={group.memberId}
        onClose={onClose}
      />
    </Modal>
  );

  useEffect(()=>{
    setParameters(parseSearchParameters(location.search))
  }, [location.search]);

  useEffect(()=>{
    if (parameters.mode === 'send') {
      onOpenSendTokenModal({
        toMemberId: parameters.to_member_id,
        amount: parseInt(parameters.amount),
      });
    }
  }, [parameters]);

  return (
    <GroupIndexTemplate
      errorMessageElement={<ErrorMessage message={message}/>}
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
      historyPanel={<HistoryPanel records={records}/>}
      modalElement={modalElement}
      footerElement={<FooterPanel/>}
    />
  );
};

export default GroupIndexPage;
