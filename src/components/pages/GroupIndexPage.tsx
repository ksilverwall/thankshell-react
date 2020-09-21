import React from 'react';
import GroupIndexTemplate from 'components/templates/GroupIndexTemplate';
import { Record } from 'components/organisms/HistoryPanel';

export default () => {
  const group = {
    groupName: 'sla',
    tokenName: 'selan',
    logoUri: "/images/logo.png",
  };
  const balance = 8000;
  const records: Record[] = [
    {
      type: 'receive',
      memberName: "田中",
      amount: 100,
      comment: "あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
      datetime: new Date('2020-09-15 10:10:10'),
    },
    {
      type: 'send',
      memberName: "田中",
      amount: 100,
      comment: "XXXXXX",
      datetime: new Date('2020-09-15 03:00:00'),
    },
    {
      type: 'receive',
      memberName: "田中",
      amount: 100,
      comment: "Yes I do",
      datetime: new Date('2020-08-15 10:10:10'),
    },
    {
      type: 'send',
      memberName: "田中",
      amount: 100,
      comment: "XXXXXX",
      datetime: new Date('2020-08-15 03:00:00'),
    },
  ];

  return (
    <GroupIndexTemplate groupName={group.groupName} tokenName={group.tokenName} logoUri={group.logoUri} balance={balance} records={records}/>
  );
};
