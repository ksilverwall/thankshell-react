import React, { useEffect, useState } from 'react';
import History from 'history';
import Modal from 'react-modal';
import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import { RestApi } from 'libs/thankshell';
import MemberSettingsView from 'components/organisms/MemberSettingsView';
import HistoryPanel from 'components/organisms/HistoryPanel';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import ErrorMessage from 'components/ErrorMessage';
import SendTokenForm from 'components/organisms/SendTokenForm';
import SendTokenButton from 'components/atoms/SendTokenButton';
import LoadEnv from 'components/app/LoadEnv';
import UseSession from 'components/app/UseSession';
import LoadGroup from 'components/app/LoadGroup';
import GroupRepository, { Group, Record } from 'libs/GroupRepository';

Modal.setAppElement('#root');

//-----------------------------------------------------------------------------
// Components

type LoadTransactionsProps = {
  controller: GroupRepository,
  group: Group,
  render: (value: {balance: number|null, records: Record[], onUpdated: ()=>void}) => JSX.Element
};

const LoadTransactions = ({controller, group, render}: LoadTransactionsProps) => {
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]>([]);

  const loadTransactions = async() => {
    setBalance(await controller.getHolding(group.memberId));
    setRecords(await controller.getTransactions(group, group.memberId));
  }

  useEffect(()=>{
    loadTransactions();
  }, []);

  return render({
    balance,
    records,
    onUpdated: loadTransactions,
  });
}


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


interface PropsType {
  match: {params: {id: string}},
  location: History.Location<History.LocationState>,
};

export default (props: PropsType) => {
  const [message, setMessage] = useState<string>('');

  return (
    <LoadEnv render={(env)=>(
      <UseSession
        callbackPath={props.location.pathname + props.location.search}
        render={({session, onSignOut})=> {
          const controller = new GroupRepository(props.match.params.id, new RestApi(session, env.apiUrl));

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
  );
};
