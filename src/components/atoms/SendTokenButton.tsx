import React from 'react';
import style from './SendTokenButton.module.css';

export default (props: {tokenName: string}) => (
  <button className={style.button}>{props.tokenName}を送る</button>
);
