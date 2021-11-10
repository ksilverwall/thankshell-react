import React from 'react';
import style from './LimitedText.module.css';

const LimitedText = (props: {text: string}) => {
  return (
    <>
      <p className={style.text}>{props.text}</p>
    </>
  )
}

export default LimitedText;
