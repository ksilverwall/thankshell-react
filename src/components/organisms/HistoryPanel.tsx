import React from 'react';
import style from './HistoryPanel.module.css';
import ReceiveHistoryRecord from 'components/molecules/ReceiveHistoryRecord';
import SendHistoryRecord from 'components/molecules/SendHistoryRecord';
import { Record } from 'components/pages/GroupIndexPage';

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

const GroupLabel = (props: {datetime: Date}) => {
  return (
    <div className={style.group_label}>
      <p>{props.datetime.getFullYear()}年{props.datetime.getMonth()+1}月</p>
    </div>
  )
};

const GroupList = (props: {datetime: Date, items: JSX.Element[]}) => {
  return (
    <>
      <GroupLabel datetime={props.datetime}/>
      <SeparateList separater={Separater}>
        {
          props.items.map((item, index) => (
            <div className={style.item} key={index}>
              {item}
            </div>
          ))
        }
      </SeparateList>
    </>
  );
};

const getYm = (datetime: Date) => {
  return new Date(datetime.getFullYear(), datetime.getMonth(), 1);
}

const getNextYm = (ym: Date) => {
  const month = ym.getMonth();

  return new Date(ym.getFullYear() + Math.floor((month+1)/12), (month+1) % 12, 1);
}

const getPreviousYm = (ym: Date) => {
  let month = ym.getMonth();

  return new Date(ym.getFullYear() - ((month === 0) ? 1 : 0), (month - 1 + 12) % 12, 1);
}

const getRecordElement = (record: Record) => {
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
;

const getBlocks = (records: Record[]): JSX.Element[] => {
  const minYm = getYm(new Date(Math.min(...records.map((record)=> record.datetime.getTime()))));
  const maxYm = getYm(new Date(Math.max(...records.map((record)=> record.datetime.getTime()))));

  const list = [];
  for (let targetYm = maxYm; minYm <= targetYm; targetYm = getPreviousYm(targetYm)) {
    const blockRecords = records.filter((record)=> targetYm <= record.datetime && record.datetime < getNextYm(targetYm));
    if (blockRecords.length) {
      list.push(
        <GroupList
          key={targetYm.toTimeString()}
          datetime={targetYm}
          items={blockRecords.sort((a, b)=>b.datetime.getTime() - a.datetime.getTime()).map(getRecordElement)}
        />
      )
    }
  }

  return list;
};

export default (props: {records: Record[]}) => {
  const elements = getBlocks(props.records);
  return (
    <div className={style.container}>
      {elements}
    </div>
  );
};
