import React, { useEffect, useState } from 'react';
import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import { Record } from 'components/organisms/HistoryPanel';
import { GetCognitoAuth } from 'libs/auth';
import { RestApi, Session, ThankshellApi } from 'libs/thankshell';
import SignInButton from 'components/SignInButton';


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

const convertRecord = (record, group) => {
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

const convert = (records: [], group): Record[] => {
  return records.map((record)=>convertRecord(record, group));
}

interface PropTypes {
  match: {params: {id: string}},
};

export default (props: PropTypes) => {
  const groupId = props.match.params.id;
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]>([]);

  const auth = GetCognitoAuth(null, null);
  const isSignedIn = auth.isUserSignedIn();

  const api = new ThankshellApi(
    new RestApi(new Session(auth), process.env.REACT_APP_THANKSHELL_API_URL)
  );

  const loadGroup = async(groupId: string) => {
    const group = await api.getGroup(groupId);
    const balance = await api.getHolding(groupId, group.memberId);
    setBalance(balance);
    const records = await api.loadTransactions(groupId, group.memberId);
    setRecords(convert(records, group));
  };

  useEffect(()=>{
    if (!isSignedIn) { return; }
    loadGroup(groupId);
  }, []);

  // FIXME: load from api
  const group = {
    groupName: 'sla',
    tokenName: 'selan',
    logoUri: "/images/logo.png",
  };

  return isSignedIn ? (
    <GroupIndexTemplate groupName={group.groupName} tokenName={group.tokenName} logoUri={group.logoUri} balance={balance} records={records}/>
  ) : (
    <div>
      <h2>サインインされていません</h2>
      <SignInButton callbackPath={location.pathname + location.search} />
    </div>
  );
};
