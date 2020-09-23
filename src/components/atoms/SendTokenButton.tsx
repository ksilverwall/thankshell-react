import React from 'react';
import style from './SendTokenButton.module.css';

interface PropTypes {
  tokenName: string,
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
};

export default (props: PropTypes) => (
  <button className={style.button} onClick={props.onClick}>{props.tokenName}を送る</button>
);
