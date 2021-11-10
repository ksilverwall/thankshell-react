import React from 'react';
import style from './ReceiveHistoryRecord.module.css';
import LimitedText from 'components/atoms/LimitedText';

interface PropTypes {
  memberName: string,
  amount: number,
  datetime: Date,
  comment: string,
}

const ReceiveHistoryRecord = (props: PropTypes) => (
  <div>
    <p className={style.title}>from {props.memberName}</p>
    <div className={style.internal_container}>
      <div className={style.comment}>
        <LimitedText text={props.comment}/>
      </div>
      <p className={style.amount}>{props.amount.toLocaleString()}</p>
      <p className={style.sign}>+</p>
    </div>
    <p className={style.date}>{props.datetime.toLocaleString()}</p>
  </div>
);

export default ReceiveHistoryRecord;
