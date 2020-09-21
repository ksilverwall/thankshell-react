import React from 'react';
import style from './HistoryPanel.module.css';
import SendHistoryRecord from 'components/molecules/SendHistoryRecord';
import ReceiveHistoryRecord from 'components/molecules/ReceiveHistoryRecord';

type TransactionType = 'send' | 'receive';

export interface Record {
  type: TransactionType,
  memberName: string,
  amount: number,
  comment: string,
  datetime: Date,
}

const Separater = () => <hr/>;

const SeparateList = (props: {separater: React.FunctionComponent, children: JSX.Element[]}) => {
  return (
    <>
      {
        props.children.map((item, index) => [item,  <props.separater key={`separater_${index}`}/>]).flat(Infinity).slice(0, -1)
      }
    </>
  );
};

const GroupList = (props: {datetime: Date, records: Record[]}) => {
  return (
    <>
      <div className={style.group_label}>
        <p>{props.datetime.toLocaleString()}</p>
      </div>
      <SeparateList separater={Separater}>
        {
          props.records.map((record, index) => (
            <div className={style.item} key={index}>
              {
                record.type === 'send'
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
            </div>
          ))
        }
      </SeparateList>
    </>
  );
};

export default (props: {records: Record[]}) => {
  const records = props.records;

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

  const minYm = getYm(new Date(Math.min(...records.map((record)=> record.datetime.getTime()))));
  const maxYm = getYm(new Date(Math.max(...records.map((record)=> record.datetime.getTime()))));

  const list = [];
  for (let targetYm = maxYm; minYm <= targetYm; targetYm = getPreviousYm(targetYm)) {
    list.push({
      ym: targetYm, 
      records: records.filter((record)=> targetYm <= record.datetime && record.datetime < getNextYm(targetYm)),
    });
  }

  return (
    <div className={style.container}>
      {
        list.map((item, index)=>(
          <GroupList key={index} datetime={item.ym} records={item.records}/>
        ))
      }
    </div>
  );
};
