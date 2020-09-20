import React from 'react';
import style from './ControlPanel.module.css';
import BalanceView from 'components/molecules/BalanceView';
import InfoIcon from 'components/atoms/InfoIcon';
import SendTokenButton from 'components/atoms/SendTokenButton';
import SearchBox from 'components/molecules/SearchBox';

export default () => (
  <div className={style.container}>
    <div className={style.inline_container}>
      <BalanceView balance={8000} tokenName='selan'/>
      <div className={style.info}>
        <InfoIcon width="24px" height="24px"/>
      </div>
    </div>
    <div className={style.send_button}>
      <SendTokenButton tokenName='selan'/>
    </div>
    <SearchBox/>
  </div>
);
