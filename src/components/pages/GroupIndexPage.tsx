import React, { useState } from 'react';
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
import { Group, Record } from 'libs/GroupRepository';


Modal.setAppElement('#root');


const GroupIndexPage = ({message, group, balance, records, onUpdateMemberName, onSendToken, onSignOut}:{
  message: string,
  group: Group,
  balance: number|null,
  records: Record[],
  onUpdateMemberName: (value: string) => Promise<void>,
  onSendToken: (memberId: string, toMemberId: string, amount: number, comment: string) => Promise<void>,
  onSignOut: ()=>void,
}) => {
  const [modalElement, setModalElement] = useState<JSX.Element|null>(null);
  const onClose = ()=>setModalElement(null);

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
            <div onClick={()=>setModalElement(
              <Modal isOpen={true} onRequestClose={onClose}>
                <SendTokenForm
                  members={group.members}
                  onSend={async(toMemberId, amount, comment)=>{
                    await onSendToken(group.memberId, toMemberId, amount, comment);
                    onClose();
                  }}
                />
              </Modal>
            )}>
              <SendTokenButton tokenName={group.tokenName}/>
            </div>
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
