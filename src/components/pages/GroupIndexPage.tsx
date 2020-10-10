import React, { useEffect, useState } from 'react';
import History from 'history';
import Modal from 'react-modal';
import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import { GetCognitoAuth } from 'libs/auth';
import { ApiGroup, ApiRecord, RestApi, Session, ThankshellApi } from 'libs/thankshell';
import SignInButton from 'components/SignInButton';
import SendTokenForm from 'components/organisms/SendTokenForm';
import SendTokenButton from 'components/atoms/SendTokenButton';
import SendHistoryRecord from 'components/molecules/SendHistoryRecord';
import ReceiveHistoryRecord from 'components/molecules/ReceiveHistoryRecord';
import MemberSettingsView from 'components/organisms/MemberSettingsView';

Modal.setAppElement('#root');

type TransactionType = 'send' | 'receive';

interface Record {
  type: TransactionType,
  memberName: string,
  amount: number,
  comment: string,
  datetime: Date,
}

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

const SendTokenButtonEx = (props: {tokenName: string, members: {}, onSend: any}) => {
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

interface PropTypes {
  match: {params: {id: string}},
  location: History.Location<History.LocationState>,
};

export default (props: PropTypes) => {
  const groupId = props.match.params.id;
  const [balance, setBalance] = useState<number|null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [group, setGroup] = useState<ApiGroup|null>(null);

  const auth = GetCognitoAuth(null, null);
  const isSignedIn = auth.isUserSignedIn();

  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    return <p>Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set</p>;
  }

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
        <SignInButton callbackPath={props.location.pathname + props.location.search} />
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

  const getYm = (datetime: Date) => {
    return new Date(datetime.getFullYear(), datetime.getMonth(), 1);
  }

  const getNextYm = (ym: Date) => {
    const month = ym.getMonth();

    return new Date(ym.getFullYear() + Math.floor(month/12), (month+1) % 12, 1);
  }

  const getPreviousYm = (ym: Date) => {
    let month = ym.getMonth();

    return new Date(ym.getFullYear() - ((month === 0) ? 1 : 0), (month - 1 + 12) % 12, 1);
  }

  const getBlocks = (records: Record[]) => {
    const minYm = getYm(new Date(Math.min(...records.map((record)=> record.datetime.getTime()))));
    const maxYm = getYm(new Date(Math.max(...records.map((record)=> record.datetime.getTime()))));

    const list = [];
    for (let targetYm = maxYm; minYm <= targetYm; targetYm = getPreviousYm(targetYm)) {
      const blockRecords = records.filter((record)=> targetYm <= record.datetime && record.datetime < getNextYm(targetYm));
      list.push({
        ym: targetYm, 
        items: blockRecords.sort((a, b)=>b.datetime.getTime() - a.datetime.getTime()).map(record => {
          return record.type === 'send'
            ? <SendHistoryRecord
              memberName={record.memberName}
              amount={record.amount}
              comment={record.comment}
              datetime={record.datetime}
            />
            : <ReceiveHistoryRecord
              memberName={record.memberName}
              amount={record.amount}
              comment={record.comment}
              datetime={record.datetime}
            />
          }
        ),
      });
    }

    return list;
  };

  const onLogout = () => auth.signOut();
  const onUpdateMemberName = (value: string) => api.updateUser(group.memberId, {displayName: value});

  return (
    <GroupIndexTemplate
      groupId={groupId}
      groupName={groupBase.groupName}
      tokenName={groupBase.tokenName}
      logoUri={groupBase.logoUri}
      balance={balance}
      sendTokenButton={sendTokenButton}
      memberSettingsView={
        <MemberSettingsView
          memberId={group.memberId}
          memberName={group.members[group.memberId].displayName}
          onUpdateMemberName={onUpdateMemberName}
          onLogout={onLogout}
        />
      }
      blocks={getBlocks(records)}
    />
  );
};
