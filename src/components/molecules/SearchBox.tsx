import React from 'react';
import SearchIcon from 'components/atoms/SearchIcon';
import style from './SearchBox.module.css';

const SearchBox = () => (
  <div className={style.box}>
    <div className={style.icon}>
      <SearchIcon width="24px" height="24px"/>
    </div>
    <p className={style.text}>履歴を検索</p>
  </div>
);

export default SearchBox;
