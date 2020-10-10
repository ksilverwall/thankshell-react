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

interface InnerPropsType {
  groupId: string,
  controller: Controller,
  group: Group,
  onLogout: () => void,
};

const GroupIndexPage = (props: InnerPropsType) => {
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]>([]);

  const loadTransactions = async() => {
    setBalance(await props.controller.getHolding(props.group.memberId));
    setRecords(await props.controller.getTransactions(props.group, props.group.memberId));
  }

  useEffect(()=>{
    loadTransactions();
  }, []);

  const onUpdateMemberName = async(value: string) => {
    try {
      props.controller.updateMemberName(value);
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <GroupIndexTemplate
      groupId={props.groupId}
      groupName={props.group.groupName}
      tokenName={props.group.tokenName}
      logoUri={props.group.logoUri}
      balance={balance}
      sendTokenButton={
        <SendTokenButtonEx
          tokenName={props.group.tokenName}
          members={props.group.members}
          onSend={async(toMemberId: string, amount: number, comment: string)=>{
            await props.controller.send(props.group.memberId, toMemberId, amount, comment);
            loadTransactions();
          }}
        />
      }
      memberSettingsView={
        <MemberSettingsView
          memberId={props.group.memberId}
          memberName={props.group.members[props.group.memberId].displayName}
          onUpdateMemberName={onUpdateMemberName}
          onLogout={props.onLogout}
        />
      }
      historyPanel={
        <HistoryPanel records={records}/>
      }
    />
  );
};

interface LoadingPropsType {
  groupId: string,
  controller: Controller,
  onLogout: () => void,
};

const GroupIndexLoadingPage = (props: LoadingPropsType) => {
  const [group, setGroup] = useState<Group|null>(null);

  useEffect(()=>{
    const loadGroup = async() => {
      setGroup(await props.controller.getGroup());
    };

    loadGroup();
  }, [props.controller]);

  if (!group) {
    return (<p>loading...</p>);
  }

  return <GroupIndexPage group={group} {...props}/>
}
 
interface PropsType {
  match: {params: {id: string}},
  location: History.Location<History.LocationState>,
};

export default (props: PropsType) => {
  const groupId = props.match.params.id;
  const auth = GetCognitoAuth(null, null);

  if (!auth.isUserSignedIn()) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <SignInButton callbackPath={props.location.pathname + props.location.search} />
      </div>
    );
  }

  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    return <p>Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set</p>;
  }

  const session = new Session(auth);
  const api = new RestApi(session, process.env.REACT_APP_THANKSHELL_API_URL);

  return (
    <GroupIndexLoadingPage
      groupId={groupId}
      controller={new Controller(groupId, api)}
      onLogout={()=>session.close()}
    />
  );
};
