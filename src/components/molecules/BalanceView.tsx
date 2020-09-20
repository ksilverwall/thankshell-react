import React from 'react';
import style from './BalanceView.module.css';

export default (props: {balance: number, tokenName: string}) => (
  <div>
    <p className={style.label}>残高</p>
    <div className={style.inline_container}>
      <p className={style.value}>{props.balance.toLocaleString()}</p>
      <p className={style.unit}>{props.tokenName}</p>
    </div>
  </div>
);
