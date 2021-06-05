import React from 'react';
import style from './ReceiveTokenButton.module.css';

interface PropTypes {
  text: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
};

const SendTokenButton = (props: PropTypes) => (
  <button className={style.button} onClick={props.onClick}>{props.text}</button>
);

export default SendTokenButton;
