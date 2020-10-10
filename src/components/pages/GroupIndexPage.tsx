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
import { valid } from 'glamor';

Modal.setAppElement('#root');

type TransactionType = 'send' | 'receive';

export interface Record {
  type: TransactionType,
  memberName: string,
  amount: number,
  comment: string,
  datetime: Date,
}

//-----------------------------------------------------------------------------
// Util functions for loading record

const getType = (memberId: string, fromMemberId: string, toMemberId: string) => {
  if (memberId === fromMemberId) {
    return 'send';
  }
  if (memberId === toMemberId) {
    return 'receive';
  }

  // FIXME
  return 'send';
};

const getMemberName = (memberId: string, members: {[key: string]: {displayName: string}}) => {
  return members[memberId] ? members[memberId].displayName : memberId
};

const convertRecord = (record: ApiRecord, group: ApiGroup): Record => {
  const transactionType = getType(group.memberId, record.from_account, record.to_account);
  return (transactionType === 'send') ? {
    type: transactionType,
    memberName: getMemberName(record.to_account, group.members),
    amount: record.amount,
    comment: record.comment,
    datetime: new Date(record.timestamp),
  } : {
    type: transactionType,
    memberName: getMemberName(record.from_account, group.members),
    amount: record.amount,
    comment: record.comment,
    datetime: new Date(record.timestamp),
  }
};

const convert = (records: [], group: ApiGroup): Record[] => {
  return records.map((record)=>convertRecord(record, group));
}

//-----------------------------------------------------------------------------
// Components

interface PropTypes {
  match: {params: {id: string}},
  location: History.Location<History.LocationState>,
};

export default (props: PropTypes) => {
  const groupId = props.match.params.id;
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [group, setGroup] = useState<ApiGroup|null>(null);
  // FIXME: load from api
  const groupBase = {
    groupName: 'sla',
    tokenName: 'selan',
    logoUri: "/images/logo.png",
  };

  const auth = GetCognitoAuth(null, null);
  const isSignedIn = auth.isUserSignedIn();

  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    return <p>Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set</p>;
  }

  const api = new ThankshellApi(
    new RestApi(new Session(auth), process.env.REACT_APP_THANKSHELL_API_URL)
  );

  //
  // callback functions
  //
  const onSend = async(fromMemberId: string, toMemberId: string, amount: number, comment: string) => {
    await api.createTransaction('selan', {
      from:    fromMemberId,
      to:      toMemberId,
      amount:  amount,
      comment: comment,
    });
  };

  const onUpdateMemberName = (groupId: string, value: string) => {
    api.updateUser(groupId, {displayName: value}).catch((error)=>{
      console.log(error);
    });
  };

  useEffect(()=>{
    const loadGroup = async(groupId: string) => {
      const group: ApiGroup = await api.getGroup(groupId);
      setGroup(group);
      const balance = await api.getHolding(groupId, group.memberId);
      setBalance(balance);
      const records = await api.loadTransactions(groupId, group.memberId);
      setRecords(convert(records, group));
    };

    if (!isSignedIn) { return; }
    loadGroup(groupId);
  }, [isSignedIn, groupId, api]);

  if (!isSignedIn) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <SignInButton callbackPath={props.location.pathname + props.location.search} />
      </div>
    );
  }

  if (!group) {
    return (<p>loading...</p>);
  }

  return (
    <GroupIndexTemplate
      groupId={groupId}
      groupName={groupBase.groupName}
      tokenName={groupBase.tokenName}
      logoUri={groupBase.logoUri}
      balance={balance}
      sendTokenButton={
        <SendTokenButtonEx
          tokenName={groupBase.tokenName}
          members={group.members}
          onSend={async(toMemberId: string, amount: number, comment: string)=>{
            await onSend(group.memberId, toMemberId, amount, comment);
          }}
        />
      }
      memberSettingsView={
        <MemberSettingsView
          memberId={group.memberId}
          memberName={group.members[group.memberId].displayName}
          onUpdateMemberName={(value) => onUpdateMemberName(groupId, value)}
          onLogout={()=>auth.signOut()}
        />
      }
      historyPanel={
        <HistoryPanel records={records}/>
      }
    />
  );
};
