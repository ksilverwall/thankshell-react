import { useEffect, useState } from 'react';
import GroupRepository, { Group, Record } from 'libs/GroupRepository';


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
};

export default LoadTransactions;
