import React from 'react';
import style from './ControlPanel.module.css';
import BalanceView from 'components/molecules/BalanceView';
import InfoIcon from 'components/atoms/InfoIcon';
import SearchBox from 'components/molecules/SearchBox';

interface PropTypes {
  balance: number|null,
  tokenName: string,
  sendTokenButton: JSX.Element,
};

export default (props: PropTypes) => {
  return (
    <div className={style.container}>
      <div className={style.inline_container}>
        <BalanceView balance={props.balance} tokenName={props.tokenName}/>
        <div className={style.info}>
          <InfoIcon width="24px" height="24px"/>
        </div>
      </div>
      <div className={style.send_button}>
        {props.sendTokenButton}
      </div>
      <SearchBox/>
    </div>
  )
};
