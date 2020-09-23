import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import { Record } from 'components/organisms/HistoryPanel';
import { GetCognitoAuth } from 'libs/auth';
import { RestApi, Session, ThankshellApi } from 'libs/thankshell';
import SignInButton from 'components/SignInButton';
import SendTokenForm from 'components/organisms/SendTokenForm';
import SendTokenButton from 'components/atoms/SendTokenButton';

Modal.setAppElement('#root');

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

const SendTokenButtonEx = (props: {tokenName: string, members: string[], onSend: any}) => {
  const [isModalOpening, setModalOpening] = useState<boolean>(false);
  const onSend = async(toMemberId: string, amount: number, comment: string) => {
    await props.onSend(toMemberId, amount, comment);
    setModalOpening(false);
  }

  return (
    <>
      <Modal isOpen={isModalOpening} onRequestClose={()=>setModalOpening(false)}>
        <SendTokenForm
          members={props.members}
          onSend={onSend}
        />
      </Modal>
      <SendTokenButton tokenName={props.tokenName} onClick={()=>setModalOpening(true)}/>
    </>
  );
};

export default (props: PropTypes) => {
  const groupId = props.match.params.id;
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [group, setGroup] = useState<{}|null>(null);

  const auth = GetCognitoAuth(null, null);
  const isSignedIn = auth.isUserSignedIn();

  const api = new ThankshellApi(
    new RestApi(new Session(auth), process.env.REACT_APP_THANKSHELL_API_URL)
  );

  const onSend = async(toMemberId: string, amount: number, comment: string) => {
    if (!group) {
      throw new Error('group is not loaded');
    }

    await api.createTransaction('selan', {
      from:    group.memberId,
      to:      toMemberId,
      amount:  amount,
      comment: comment,
    });
  };

  const loadGroup = async(groupId: string) => {
    const group = await api.getGroup(groupId);
    setGroup(group);
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
  const groupBase = {
    groupName: 'sla',
    tokenName: 'selan',
    logoUri: "/images/logo.png",
  };

  if (!isSignedIn) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <SignInButton callbackPath={location.pathname + location.search} />
      </div>
    );
  }

  if (!group) {
    return (<p>loading...</p>);
  }

  const sendTokenButton = (
    <SendTokenButtonEx
      tokenName={groupBase.tokenName}
      members={group.members}
      onSend={onSend}
    />
  );

  return (
    <GroupIndexTemplate
      groupName={groupBase.groupName}
      tokenName={groupBase.tokenName}
      logoUri={groupBase.logoUri}
      balance={balance}
      records={records}
      sendTokenButton={sendTokenButton}
    />
  );
};
