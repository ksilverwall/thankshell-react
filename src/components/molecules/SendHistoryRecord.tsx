import React from 'react';
import style from './SendHistoryRecord.module.css';
import LimitedText from 'components/atoms/LimitedText';

interface PropTypes {
  memberName: string,
  amount: number,
  datetime: Date,
  comment: string,
}

const SendHistoryRecord = (props: PropTypes) => (
  <div>
    <p className={style.title}>to {props.memberName}</p>
    <div className={style.internal_container}>
      <div className={style.comment}>
        <LimitedText text={props.comment}/>
      </div>
      <p className={style.amount}>{props.amount.toLocaleString()}</p>
      <p className={style.sign}>-</p>
    </div>
    <p className={style.date}>{props.datetime.toLocaleString()}</p>
  </div>
);

export default SendHistoryRecord;
