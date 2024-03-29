import React from 'react';
import style from './BalanceView.module.css';

const BalanceView = (props: {balance: number|null, tokenName: string}) => (
  <div>
    <p className={style.label}>残高</p>
    <div className={style.inline_container}>
      <p className={style.value}>{(props.balance === null) ? '--' : props.balance.toLocaleString()}</p>
      <p className={style.unit}>{props.tokenName}</p>
    </div>
  </div>
);

export default BalanceView;
