import React from 'react';
import style from './LimitedText.module.css';

export default (props: {text: string}) => {
  return (
    <>
      <p className={style.text}>{props.text}</p>
    </>
  )
}
