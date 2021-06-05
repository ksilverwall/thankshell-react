import React, { useEffect, useState } from 'react';
import History from 'history';
import Modal from 'react-modal';
import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import { GetCognitoAuth } from 'libs/auth';
import { ApiGroup, ApiRecord, RestApi, Session, ThankshellApi } from 'libs/thankshell';
import SignInButton from 'components/SignInButton';
import MemberSettingsView from 'components/organisms/MemberSettingsView';
import HistoryPanel from 'components/organisms/HistoryPanel';
import SendTokenButtonEx from 'components/organisms/SendTokenButtonEx';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import ErrorMessage from 'components/ErrorMessage';

Modal.setAppElement('#root');

type TransactionType = 'send' | 'receive';

export interface Record {
  type: TransactionType,
  memberName: string,
  amount: number,
  comment: string,
  datetime: Date,
}

interface Group {
  memberId: string,
  members: {[key: string]: {state: string, displayName: string}},
  groupName: string,
  tokenName: string,
  logoUri: string,
}

class Controller {
  groupId: string;
  api: ThankshellApi;

  constructor(groupId: string, api: RestApi) {
    this.groupId = groupId;
    this.api = new ThankshellApi(api);
  }

  async send(fromMemberId: string, toMemberId: string, amount: number, comment: string): Promise<void> {
    await this.api.createTransaction('selan', {
      from:    fromMemberId,
      to:      toMemberId,
      amount:  amount,
      comment: comment,
    });
  }

  async updateMemberName(value: string): Promise<void> {
    await this.api.updateUser(this.groupId, {displayName: value});
  }

  async getGroup(): Promise<Group> {
    const apiGroup = await this.api.getGroup(this.groupId);

    return {
      groupName: 'sla',
      logoUri: "/images/logo.png",
      ...apiGroup,
    };
  }

  async getHolding(memberId: string): Promise<number> {
    return await this.api.getHolding(this.groupId, memberId);
  }

  async getTransactions(group: any, memberId: string): Promise<Record[]> {
    const records = await this.api.loadTransactions(this.groupId, memberId);

    return this.__convert(records, group);
  } 

  __convert (records: [], group: ApiGroup): Record[] {
    return records.map((record)=>this.convertRecord(record, group));
  }

  getType (memberId: string, fromMemberId: string, toMemberId: string) {
    if (memberId === fromMemberId) {
      return 'send';
    }
    if (memberId === toMemberId) {
      return 'receive';
    }

    // FIXME
    return 'send';
  };

  getMemberName (memberId: string, members: {[key: string]: {displayName: string}}) {
    return members[memberId] ? members[memberId].displayName : memberId
  };

  convertRecord (record: ApiRecord, group: ApiGroup): Record {
    const transactionType = this.getType(group.memberId, record.from_account, record.to_account);
    return (transactionType === 'send') ? {
      type: transactionType,
      memberName: this.getMemberName(record.to_account, group.members),
      amount: record.amount,
      comment: record.comment,
      datetime: new Date(record.timestamp),
    } : {
      type: transactionType,
      memberName: this.getMemberName(record.from_account, group.members),
      amount: record.amount,
      comment: record.comment,
      datetime: new Date(record.timestamp),
    }
  };
}

//-----------------------------------------------------------------------------
// Components

type LoadTransactionsProps = {
  controller: Controller,
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

const GroupIndexPage = ({api, groupId, onSignOut}: {api: RestApi, groupId: string, onSignOut: ()=>void})=>{
  const [message, setMessage] = useState<string>('');

  const controller = new Controller(groupId, api);

  return (
    <LoadGroup
      controller={controller}
      onLoading={()=><p>loading...</p>}
      onLoaded={(group)=>(
        <LoadTransactions
          controller={controller}
          group={group}
          render={({balance, records, onUpdated})=>(
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
                      onUpdateMemberName={async(value)=>{
                        try {
                          await controller.updateMemberName(value);
                        } catch(error) {
                          setMessage(error.message);
                        }
                      }}
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
                    <SendTokenButtonEx
                      tokenName={group.tokenName}
                      members={group.members}
                      onSend={async(toMemberId: string, amount: number, comment: string)=>{
                        await controller.send(group.memberId, toMemberId, amount, comment);
                        onUpdated();
                      }}
                    />
                  }
                />
              }
              historyPanel={
                <HistoryPanel records={records}/>
              }
              footerElement={<FooterPanel/>}
            />
          )}
        />
      )}
    />
  );
}

interface LoadGroupProps {
  controller: Controller,
  onLoading: () => JSX.Element,
  onLoaded:(group: Group) => JSX.Element,
};

const LoadGroup = ({controller, onLoading, onLoaded}: LoadGroupProps) => {
  const [group, setGroup] = useState<Group>();

  useEffect(()=>{
    controller.getGroup().then(setGroup).catch(()=>console.error("Fail to load"));
  }, [controller]);

  return group ? onLoaded(group) : onLoading();
}
 
const UseSession = ({callbackPath, render}: {callbackPath: string, render: (params: {session: Session, onSignOut: ()=>void})=>JSX.Element}) => {
  const auth = GetCognitoAuth(null, null);

  if (!auth.isUserSignedIn()) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <SignInButton callbackPath={callbackPath} />
      </div>
    );
  }
  const session = new Session(auth);

  return render({session, onSignOut: session.close});
};

type EnvironmentVariables = {
  apiUrl: string,
}

const LoadEnv = ({render}: {render: (env: EnvironmentVariables)=>JSX.Element}) => {
  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    throw new Error("Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set");
  }

  return render({
    apiUrl: process.env.REACT_APP_THANKSHELL_API_URL,
  });
}

interface PropsType {
  match: {params: {id: string}},
  location: History.Location<History.LocationState>,
};

export default (props: PropsType) => {
  return (
    <LoadEnv render={(env)=>(
      <UseSession
        callbackPath={props.location.pathname + props.location.search}
        render={({session, onSignOut})=> (
          <GroupIndexPage
            api={new RestApi(session, env.apiUrl)}
            groupId={props.match.params.id}
            onSignOut={onSignOut}
          />
        )}
      />
    )}/>
  );
};
